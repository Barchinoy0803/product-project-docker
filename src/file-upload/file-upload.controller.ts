import { Controller, Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('upload')
export class FileUploadController {
    @UseInterceptors(
        FileInterceptor('avatar', {
          storage: diskStorage({
            destination: './uploads',
            filename(req, file, cb) {
              let filename = `${Date.now()}-${Math.random() * 8}${path.extname(file.originalname)}`;
              cb(null, filename);
            },
          }),
        }),
      )
      UploadedFile(@UploadedFile() file: Express.Multer.File) {
        return { file: file.filename };
      }
}
