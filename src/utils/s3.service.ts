import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

  async uploadFile(file: Express.Multer.File, currentFileKey?: string) {
    const params = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: `attach-${crypto.randomBytes(8).toString('hex')}.${file.mimetype.split('/')[1]}`,
      Body: file.buffer,
      acl: 'public-read',
      ContentType: file.mimetype,
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION,
      },
    };

    try {
      if (currentFileKey) await this.deleteFile(await this.getKeyFromUrl(currentFileKey));
      return await this.s3.upload(params).promise();
    } catch (e) {
      throw new HttpException(e.response || { error: 'Something wrong on upload file' }, 500);
    }
  }

  async deleteFile(key: string) {
    try {
      await this.s3.deleteObject({ Bucket: process.env.AWS_PUBLIC_BUCKET_NAME, Key: key }).promise();
      return { message: 'Deleted successfully' };
    } catch (e) {
      throw new HttpException({ error: "Can't delete the file" }, 200);
    }
  }

  async getKeyFromUrl(url: string) {
    return url.split('m/')[1];
  }
}
