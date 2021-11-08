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

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);

  callback(null, `${Date.now()}_${v1()}${fileExtName}`);
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
