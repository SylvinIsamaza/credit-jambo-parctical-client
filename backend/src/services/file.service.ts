import { minioClient, BUCKET_NAME } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  static async uploadProfileImage(buffer: Buffer, originalName: string): Promise<string> {
    try {
      const fileName = `profiles/${uuidv4()}-${originalName}`;
      await minioClient.putObject(BUCKET_NAME, fileName, buffer);
      return fileName;
    } catch (error) {
      throw new Error('File upload service unavailable');
    }
  }

  static async getFileUrl(fileName: string): Promise<string> {
    try {
      return await minioClient.presignedGetObject(BUCKET_NAME, fileName, 24 * 60 * 60);
    } catch (error) {
      throw new Error('File service unavailable');
    }
  }

  static async deleteFile(fileName: string): Promise<void> {
    try {
      await minioClient.removeObject(BUCKET_NAME, fileName);
    } catch (error:any) {
      console.warn('Failed to delete file:', error.message);
    }
  }

  static async initializeBucket(): Promise<void> {
    try {
      const exists = await minioClient.bucketExists(BUCKET_NAME);
      if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME);
      }
    } catch (error) {
      console.warn('MinIO not available, file upload will be disabled:', error.message);
    }
  }
}