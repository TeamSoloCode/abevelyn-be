import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import { parse, extname, join } from 'path';
import { v1 } from 'uuid';

export const imageFileFilter = (req, file, callback) => {
  console.log('abcd', file.originalname);
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file,
  callback,
  category: string,
) => {
  console.log('abcd 1', req.body);
  const fileExtName = extname(file.originalname);

  callback(null, `${category}_${Date.now()}_${v1()}${fileExtName}`);
};

export const deleteUnusedImage = (
  deletedFile: string,
  callback?: () => void,
) => {
  const filePath = join(process.cwd(), `/uploads/${deletedFile}`);
  if (!existsSync(filePath)) {
    unlink(filePath, callback);
  }
};

export class ApiResponse<T> {
  constructor(data: T, message?: string, errorCode?: string) {
    this.code = errorCode;
    this.data = data;
    this.message = message;
  }

  code: string;
  data: T;
  message: string;
}

export function isNumeric(x) {
  return (typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x));
}
