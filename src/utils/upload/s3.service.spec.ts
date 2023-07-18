import { IS3Service } from 'src/utils/upload/s3.interface';
import { createMockImage } from 'src/utils/upload/mocks/image.mock';
import { S3Service } from './s3.service';
import { BadRequestException } from '@nestjs/common';

describe('S3Service', () => {
  let s3Service: IS3Service;
  let mockS3Instance: any;
  const image: Express.Multer.File = createMockImage();

  const uploadedImage: AWS.S3.ManagedUpload.SendData = {
    Location: 'https://condo-tests.s3.amazonaws.com/attach-teste.png',
    Bucket: 'bucket-teste',
    Key: 'teste-image.png',
    ETag: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  };

  beforeEach(() => {
    mockS3Instance = {
      upload: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValue(uploadedImage),
      deleteObject: jest.fn().mockReturnThis(),
    };
    s3Service = new S3Service();
    s3Service['s3'] = mockS3Instance;
  });

  describe('uploadFile', () => {
    it('should delete the current file before uploading a new file if currentFileKey is provided', async () => {
      const mockCurrentFileKey = 'attach-oldfile.jpg';
      const mockDeleteResponse = {
        message: 'Deleted successfully',
      };

      s3Service.getKeyFromUrl = jest.fn().mockResolvedValue(mockCurrentFileKey);
      s3Service.deleteFile = jest.fn().mockResolvedValue(mockDeleteResponse);

      const result = await s3Service.uploadFile(image, mockCurrentFileKey);

      expect(s3Service.getKeyFromUrl).toHaveBeenCalledWith(mockCurrentFileKey);
      expect(s3Service.deleteFile).toHaveBeenCalledWith(mockCurrentFileKey);
      expect(mockS3Instance.upload).toHaveBeenCalled();
      expect(mockS3Instance.upload().promise).toHaveBeenCalled();
      expect(result).toEqual(uploadedImage);
    });

    it('should upload a file to S3 and return the upload response', async () => {
      const result = await s3Service.uploadFile(image);

      expect(mockS3Instance.upload).toHaveBeenCalledWith({
        Bucket: undefined,
        Key: expect.any(String),
        Body: image.buffer,
        acl: 'public-read',
        ContentType: image.mimetype,
        CreateBucketConfiguration: {
          LocationConstraint: undefined,
        },
      });
      expect(mockS3Instance.upload().promise).toHaveBeenCalled();
      expect(result).toEqual(uploadedImage);
    });

    it('should throw a bad request exception if there is an error during upload', async () => {
      mockS3Instance.upload().promise.mockRejectedValue(BadRequestException);

      const s3Service: IS3Service = new S3Service();
      s3Service['s3'] = mockS3Instance;

      await expect(s3Service.uploadFile(image)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from S3 and return the delete response', async () => {
      const mockKey = 'attach-file123.jpg';

      const result = await s3Service.deleteFile(mockKey);

      expect(mockS3Instance.deleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: undefined,
          Key: mockKey,
        }),
      );
      expect(mockS3Instance.deleteObject().promise).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Deleted successfully' });
    });

    it('should throw a bad request exception if there is an error during deletion', async () => {
      const mockKey = 'attach-file123.jpg';
      mockS3Instance.deleteObject().promise.mockRejectedValue(BadRequestException);

      await expect(s3Service.deleteFile(mockKey)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getKeyFromUrl', () => {
    it('should return the file key from the given URL', async () => {
      const result = await s3Service.getKeyFromUrl('https://condo-assets.s3.amazonaws.com/attach-file123.jpg');
      expect(result).toEqual('attach-file123.jpg');
    });
  });
});
