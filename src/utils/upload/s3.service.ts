import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import { IS3Service } from './s3.interface';

@Injectable()
export class S3Service implements IS3Service {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.bucket = process.env.AWS_PUBLIC_BUCKET_NAME;
    this.region = process.env.AWS_REGION;
  }

  async uploadFile(file: Express.Multer.File, currentFileKey?: string): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: this.bucket,
      Key: `attach-${crypto.randomBytes(8).toString('hex')}.${file.mimetype.split('/')[1]}`,
      Body: file.buffer,
      acl: 'public-read',
      ContentType: file.mimetype,
      CreateBucketConfiguration: {
        LocationConstraint: this.region,
      },
    };

    try {
      if (currentFileKey) await this.deleteFile(await this.getKeyFromUrl(currentFileKey));
      return await this.s3.upload(params).promise();
    } catch (e) {
      throw new BadRequestException(e.response || 'Something wrong on upload file');
    }
  }

  async deleteFile(key: string): Promise<{ message: string }> {
    try {
      await this.s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
      return { message: 'Deleted successfully' };
    } catch (e) {
      throw new BadRequestException("Can't delete the file");
    }
  }

  async getKeyFromUrl(url: string): Promise<string> {
    return url.split('m/')[1];
  }
}
