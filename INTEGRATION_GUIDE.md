# LLM Integration Guide

This guide will help you integrate the actual language model (Gemma 3 1B or Llama 3.2 1B) into Theramind.

## Current Status

✅ **Completed:**
- Beautiful UI with gradient animations
- Chat interface with message bubbles
- State management with Zustand
- Local storage for conversations
- Service architecture ready for LLM integration

🚧 **Needs Integration:**
- Actual llama.cpp React Native bindings
- Model loading and inference
- Token streaming from model

## Integration Steps

### 1. Choose an LLM Library

You have several options for running LLMs in React Native:

#### Option A: react-native-llama.cpp (Recommended)
```bash
npm install @jhen/react-native-llama

# For bare React Native:
cd ios && pod install
```

**Pros:** Direct llama.cpp bindings, supports GGUF, good performance
**Cons:** Requires native module setup

**Repository:** https://github.com/jhen0409/react-native-llama

#### Option B: llama.rn
```bash
npm install llama.rn
```

**Pros:** Simpler API, good documentation
**Cons:** Less actively maintained

#### Option C: ONNX Runtime Mobile
```bash
npm install onnxruntime-react-native
```

**Pros:** Supports multiple model formats
**Cons:** Not optimized specifically for LLMs

### 2. Download the Model

Choose one of these models (all are mobile-friendly):

**Gemma 3 1B (Recommended):**
- Model: `gemma-3-1b-Q4_K_M.gguf`
- Size: ~529MB
- Source: Hugging Face

```bash
# Example download URL structure
https://huggingface.co/lmstudio-community/gemma-3-1b-GGUF/resolve/main/gemma-3-1b-Q4_K_M.gguf
```

**Llama 3.2 1B:**
- Model: `Llama-3.2-1B-Instruct-Q4_K_M.gguf`
- Size: ~600MB
- Source: Hugging Face

```bash
# Example download URL structure
https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf
```

### 3. Update LLMService

Replace the placeholder implementation in `src/services/LLMService.ts`:

```typescript
import { initLlama, LlamaContext } from '@jhen/react-native-llama';

class LLMService {
  private context: LlamaContext | null = null;

  async initialize(modelPath: string): Promise<void> {
    try {
      await initLlama();
      
      this.context = await LlamaContext.initContext({
        model: modelPath,
        n_ctx: 2048,
        n_batch: 512,
        n_threads: 4,
      });

      this.isInitialized = true;
      console.log('[LLM] Initialized successfully');
    } catch (error) {
      console.error('[LLM] Initialization error:', error);
      throw error;
    }
  }

  async generateStream(
    prompt: string,
    config: LLMConfig,
    callbacks: StreamCallback
  ): Promise<void> {
    if (!this.context) {
      callbacks.onError(new Error('LLM not initialized'));
      return;
    }

    try {
      const formattedPrompt = this.formatPrompt(prompt);
      
      await this.context.completion(
        {
          prompt: formattedPrompt,
          n_predict: config.maxTokens,
          temperature: config.temperature,
          top_p: config.topP,
          top_k: config.topK,
          stop: ['</s>', '<|eot_id|>', '<end_of_turn>'],
        },
        (data) => {
          // Called for each token
          if (data.token) {
            callbacks.onToken(data.token);
          }
          
          // Check if complete
          if (data.stop) {
            callbacks.onComplete();
          }
        }
      );
    } catch (error) {
      callbacks.onError(error as Error);
    }
  }

  private formatPrompt(userMessage: string): string {
    // For Gemma 3:
    return `<start_of_turn>user\n${userMessage}<end_of_turn>\n<start_of_turn>model\n`;
    
    // For Llama 3.2:
    // return `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`;
  }

  async unload(): Promise<void> {
    if (this.context) {
      await this.context.release();
      this.context = null;
      this.isInitialized = false;
    }
  }
}
```

### 4. Update ChatScreen to Use Streaming

Modify `app/chat.tsx` to use the actual LLM service:

```typescript
import { llmService } from '../src/services/LLMService';
import { useChatStore } from '../src/store/chatStore';

// In handleSendWithId:
const handleSendWithId = async (conversationId: string, text: string) => {
  // Add user message (same as before)
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: text,
    timestamp: Date.now(),
  };
  addMessage(conversationId, userMessage);
  setGenerating(true);

  // Create AI message with empty content
  const aiMessageId = (Date.now() + 1).toString();
  const aiMessage: Message = {
    id: aiMessageId,
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
  };
  addMessage(conversationId, aiMessage);

  // Generate with streaming
  let fullResponse = '';
  
  await llmService.generateStream(
    text,
    modelConfig,
    {
      onToken: (token) => {
        fullResponse += token;
        updateMessageContent(conversationId, aiMessageId, fullResponse);
      },
      onComplete: () => {
        setGenerating(false);
      },
      onError: (error) => {
        console.error('Generation error:', error);
        updateMessageContent(
          conversationId,
          aiMessageId,
          'Sorry, I encountered an error. Please try again.'
        );
        setGenerating(false);
      },
    }
  );
};
```

### 5. Initialize the Model on App Start

Update `app/_layout.tsx` to initialize the LLM:

```typescript
import { useEffect, useState } from 'react';
import { llmService } from '../src/services/LLMService';
import { storageService } from '../src/services/StorageService';
import { useChatStore } from '../src/store/chatStore';

export default function RootLayout() {
  const [isModelReady, setIsModelReady] = useState(false);
  const { setModelLoaded } = useChatStore();

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      const modelPath = await storageService.getModelPath();
      
      if (modelPath) {
        await llmService.initialize(modelPath);
        setModelLoaded(true);
        setIsModelReady(true);
      }
    } catch (error) {
      console.error('Failed to initialize model:', error);
    }
  };

  // ... rest of the component
}
```

### 6. Update StorageService Download

Add real model download in `src/services/StorageService.ts`:

```typescript
async downloadModel(
  url: string,
  modelName: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  await this.ensureModelDirectory();
  const modelPath = `${this.getModelDirectory()}${modelName}.gguf`;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    modelPath,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      onProgress?.(progress);
    }
  );

  const result = await downloadResumable.downloadAsync();
  
  if (!result) {
    throw new Error('Download failed');
  }

  // Save metadata
  const fileInfo = await FileSystem.getInfoAsync(result.uri);
  await this.saveModelMetadata({
    name: modelName,
    path: result.uri,
    size: fileInfo.size || 0,
    downloadedAt: Date.now(),
    version: '1.0',
  });

  return result.uri;
}
```

### 7. Test on Physical Devices

**Important:** Emulators/simulators won't give accurate performance metrics.

**iOS Testing:**
```bash
npm run ios
```

**Android Testing:**
```bash
npm run android
```

**Monitor:**
- Memory usage (should stay under 2GB)
- Token generation speed (target: 15-30 tokens/sec)
- Battery drain
- App responsiveness

### 8. Optimize Performance

**Memory Management:**
- Unload model when app goes to background
- Implement model lifecycle management
- Monitor memory warnings

**Inference Speed:**
- Adjust n_threads based on device
- Use appropriate n_batch size
- Consider quantization levels (Q4 vs Q8)

**Battery:**
- Throttle inference on low battery
- Add user setting for power mode

## Troubleshooting

### Model won't load
- Check file path is correct
- Verify model format is GGUF
- Ensure enough free space (2GB+)
- Check device RAM (need 6GB+)

### Slow inference
- Reduce n_ctx (context window)
- Lower n_threads
- Try smaller model
- Check device isn't thermal throttling

### App crashes
- Model too large for device
- Not enough RAM available
- Memory leak in streaming
- Add error boundaries

## Resources

- [llama.cpp Documentation](https://github.com/ggerganov/llama.cpp)
- [react-native-llama GitHub](https://github.com/jhen0409/react-native-llama)
- [Hugging Face Models](https://huggingface.co/models?library=gguf)
- [GGUF Format Spec](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)

## Need Help?

Open an issue on GitHub with:
- Device model and OS version
- Model being used
- Error logs
- Memory usage stats

---

Good luck with the integration! 🚀

