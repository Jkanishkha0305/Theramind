import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const MODEL_METADATA_KEY = '@theramind_model_metadata';
const SETTINGS_KEY = '@theramind_settings';

export interface ModelMetadata {
  name: string;
  path: string;
  size: number;
  downloadedAt: number;
  version: string;
}

export interface AppSettings {
  temperature: number;
  maxTokens: number;
  theme: 'dark' | 'light';
  hapticFeedback: boolean;
}

class StorageService {
  /**
   * Get the model directory path
   */
  getModelDirectory(): string {
    return `${FileSystem.documentDirectory}models/`;
  }

  /**
   * Check if model directory exists, create if not
   */
  async ensureModelDirectory(): Promise<void> {
    const modelDir = this.getModelDirectory();
    const dirInfo = await FileSystem.getInfoAsync(modelDir);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
      console.log('[Storage] Created model directory:', modelDir);
    }
  }

  /**
   * Save model metadata
   */
  async saveModelMetadata(metadata: ModelMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(MODEL_METADATA_KEY, JSON.stringify(metadata));
      console.log('[Storage] Model metadata saved');
    } catch (error) {
      console.error('[Storage] Failed to save model metadata:', error);
      throw error;
    }
  }

  /**
   * Get model metadata
   */
  async getModelMetadata(): Promise<ModelMetadata | null> {
    try {
      const data = await AsyncStorage.getItem(MODEL_METADATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Failed to get model metadata:', error);
      return null;
    }
  }

  /**
   * Check if model is downloaded
   */
  async isModelDownloaded(): Promise<boolean> {
    const metadata = await this.getModelMetadata();
    if (!metadata) return false;

    const fileInfo = await FileSystem.getInfoAsync(metadata.path);
    return fileInfo.exists;
  }

  /**
   * Get model file path
   */
  async getModelPath(): Promise<string | null> {
    const metadata = await this.getModelMetadata();
    if (!metadata) return null;

    const fileInfo = await FileSystem.getInfoAsync(metadata.path);
    return fileInfo.exists ? metadata.path : null;
  }

  /**
   * Delete model file
   */
  async deleteModel(): Promise<void> {
    try {
      const metadata = await this.getModelMetadata();
      if (metadata) {
        await FileSystem.deleteAsync(metadata.path, { idempotent: true });
        await AsyncStorage.removeItem(MODEL_METADATA_KEY);
        console.log('[Storage] Model deleted');
      }
    } catch (error) {
      console.error('[Storage] Failed to delete model:', error);
      throw error;
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('[Storage] Failed to save settings:', error);
      throw error;
    }
  }

  /**
   * Get app settings
   */
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data
        ? JSON.parse(data)
        : {
            temperature: 0.7,
            maxTokens: 512,
            theme: 'dark',
            hapticFeedback: true,
          };
    } catch (error) {
      console.error('[Storage] Failed to get settings:', error);
      return {
        temperature: 0.7,
        maxTokens: 512,
        theme: 'dark',
        hapticFeedback: true,
      };
    }
  }

  /**
   * Download model with progress tracking
   */
  async downloadModel(
    url: string,
    modelName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      await this.ensureModelDirectory();
      
      const modelPath = `${this.getModelDirectory()}${modelName}.gguf`;
      console.log('[Storage] Downloading model to:', modelPath);

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
        size: (fileInfo.exists && !fileInfo.isDirectory && 'size' in fileInfo) ? fileInfo.size : 0,
        downloadedAt: Date.now(),
        version: '1.0',
      });

      console.log('[Storage] Model downloaded successfully');
      return result.uri;
    } catch (error) {
      console.error('[Storage] Download error:', error);
      throw error;
    }
  }

  /**
   * Get available storage space
   */
  async getAvailableSpace(): Promise<number> {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      return info;
    } catch (error) {
      console.error('[Storage] Failed to get available space:', error);
      return 0;
    }
  }
}

export const storageService = new StorageService();

