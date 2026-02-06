/**
 * 上傳 Service - 封裝檔案上傳相關的 API 呼叫
 */
import axios from 'axios';
import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

interface PresignResponse {
  uploadUrl: string;
  key: string;
  url: string;
  bucket: string;
  expiresIn: number;
}

export const uploadService = {
  /** 取得單一預簽名上傳 URL */
  getPresignedUrl: async (file: {
    filename: string;
    mimeType: string;
    size: number;
  }) => {
    const response = await api.post<ApiResponse<PresignResponse>>(
      '/api/uploads/presign',
      file
    );
    return response.data;
  },

  /** 批量取得預簽名上傳 URL */
  getPresignedUrls: async (
    files: Array<{
      filename: string;
      mimeType: string;
      size: number;
    }>
  ) => {
    const response = await api.post<ApiResponse<PresignResponse[]>>(
      '/api/uploads/presign-batch',
      { files }
    );
    return response.data;
  },

  /** 上傳檔案到 S3 或本地 */
  uploadFile: async (uploadUrl: string, file: File) => {
    if (
      uploadUrl.startsWith('/api/uploads/local/') ||
      uploadUrl.includes('/local/')
    ) {
      // 本地儲存
      const formData = new FormData();
      formData.append('file', file);
      await api.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      // S3 上傳
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });
    }
  },

  /** 完整上傳流程（取得 URL -> 上傳 -> 回傳最終 URL） */
  upload: async (file: File): Promise<string> => {
    const presign = await uploadService.getPresignedUrl({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    });

    await uploadService.uploadFile(presign.data.uploadUrl, file);

    return presign.data.url;
  },
};
