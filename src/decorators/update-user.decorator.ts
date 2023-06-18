import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function UpdateUser(fieldName: string[], required = false, localOptions?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName[0], localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? fieldName : [],
        properties: {
          image: {
            description: 'Allows .png, .jpg and jpeg - max size = 5MB',
            type: 'string',
            format: 'binary',
          },
          name: {
            description: 'Name to presentation',
            type: 'string',
          },
          password: {
            description: 'New password, must have 10 character and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
            type: 'string',
          },
          passwordConfirmation: {
            description: 'Must be equal to password above',
            type: 'string',
          },
        },
      },
    }),
  );
}
