import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  StreamableFile,
  Req,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { deleteUnusedImage, editFileName, imageFileFilter } from '../utils';

@Controller('file')
export class FileController {
  @Get('*')
  // @UseGuards(AuthGuard())
  getFile(
    @Req() req: Request,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    const fileName = req.url.split('/')[2];
    if (!existsSync(join(process.cwd(), `/uploads/${fileName}`))) {
      throw new NotFoundException();
    }

    const file = createReadStream(join(process.cwd(), `/uploads/${fileName}`));
    res.set({
      'Content-Type': 'image/jpeg',
      // 'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }

  @Post('multiple_upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFiles(@UploadedFiles() files) {
    const response = [];
    files?.forEach((file) => {
      const fileReponse = {
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file) {
    return { filename: file.filename };
  }
}
