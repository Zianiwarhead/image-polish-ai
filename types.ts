export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
}
