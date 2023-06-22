export interface IS3Service {
  uploadFile(file: Express.Multer.File, currentFileKey?: string): Promise<AWS.S3.ManagedUpload.SendData>;
  deleteFile(key: string): Promise<{ message: string }>;
  getKeyFromUrl(url: string): Promise<string>;
}

export const IS3Service = Symbol('IS3Service');
