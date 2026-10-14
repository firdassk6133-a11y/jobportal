import { apiClient } from './apiClient';
import type { ApiResponse, PresignedUploadResponse, PresignedDownloadResponse } from '../types';

export const MIME_TYPE_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function resolveResumeContentType(
  fileName: string,
  mimeType?: string
): { fileExtension: string; contentType: string } {
  const fileExtension = fileName.split('.').pop()?.toLowerCase().replace(/^\./, '') || '';
  let contentType = mimeType || '';
  if (!contentType || contentType === 'application/octet-stream') {
    contentType = MIME_TYPE_MAP[fileExtension] || 'application/pdf';
  }
  return { fileExtension, contentType };
}

export const fileService = {
  async getPresignedUpload(
    fileName: string,
    fileType?: string,
    fileSize?: number
  ): Promise<PresignedUploadResponse> {
    const { fileExtension, contentType } = resolveResumeContentType(fileName, fileType);
    const res = await apiClient.post<ApiResponse<PresignedUploadResponse>>(
      '/files/presigned-upload',
      {
        fileExtension,
        contentType,
        fileName,
        fileType: contentType,
        fileSize,
      }
    );
    return res.data.data;
  },

  async uploadFileToS3(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
    contentType?: string
  ): Promise<void> {
    // S3 PUT must NOT include the Bearer token header, use a standalone fetch or XMLHttpRequest
    return new Promise((resolve, reject) => {
      const { contentType: resolvedContentType } = resolveResumeContentType(
        file.name,
        contentType || file.type
      );

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', resolvedContentType);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status code ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during S3 file upload'));
      };

      xhr.send(file);
    });
  },

  async getPresignedDownload(fileKey: string): Promise<PresignedDownloadResponse> {
    // encodeURIComponent on fileKey to preserve path slashes
    const encodedKey = encodeURIComponent(fileKey);
    const res = await apiClient.get<ApiResponse<PresignedDownloadResponse>>(
      `/files/presigned-download/${encodedKey}`
    );
    return res.data.data;
  },
};
