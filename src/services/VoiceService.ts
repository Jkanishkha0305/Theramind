import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

class VoiceService {
  private recording: Audio.Recording | null = null;
  private isSpeaking: boolean = false;

  /**
   * Initialize audio permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      return granted;
    } catch (error) {
      console.error('[Voice] Permission error:', error);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      // Clean up any existing recording first
      if (this.recording) {
        try {
          await this.recording.stopAndUnloadAsync();
        } catch (e) {
          // Ignore cleanup errors
        }
        this.recording = null;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      console.error('[Voice] Recording start error:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return URI
   */
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) return null;

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (error) {
      console.error('[Voice] Recording stop error:', error);
      return null;
    }
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording !== null;
  }

  /**
   * Convert audio to text using OpenAI Whisper
   * Note: This requires OpenAI API integration
   */
  async transcribeAudio(audioUri: string, openAIKey: string): Promise<string> {
    try {
      // Read the audio file
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAIKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('[Voice] Transcription error:', error);
      throw error;
    }
  }

  /**
   * Speak text using device TTS
   */
  async speak(text: string, options?: Speech.SpeechOptions): Promise<void> {
    try {
      // Stop any current speech
      await this.stopSpeaking();

      this.isSpeaking = true;

      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        ...options,
        onDone: () => {
          this.isSpeaking = false;
        },
        onError: () => {
          this.isSpeaking = false;
        },
      });
    } catch (error) {
      console.error('[Voice] Speech error:', error);
      this.isSpeaking = false;
    }
  }

  /**
   * Stop current speech
   */
  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('[Voice] Stop speech error:', error);
    }
  }

  /**
   * Check if currently speaking
   */
  getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get available voices
   */
  async getAvailableVoices() {
    return await Speech.getAvailableVoicesAsync();
  }
}

export const voiceService = new VoiceService();

