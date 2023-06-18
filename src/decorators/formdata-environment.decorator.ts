import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Status } from 'src/environments/entities/status.enum';
const getEnumValues = (enumObject: any): string[] => {
  return Object.keys(enumObject).map((key) => enumObject[key]);
};

export function FormDataEnvironment(fieldName: string[], required = false, localOptions?: MulterOptions) {
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
          description: {
            description: "Environment's description",
            type: 'string',
          },
          status: {
            description: "Environment's status",
            type: 'enum',
            enum: getEnumValues(Status),
          },
          capacity: {
            description: "Environment's capacity",
            type: 'number',
          },
        },
      },
    }),
  );
}
