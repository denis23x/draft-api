/** @format */

import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const FileMulterField: MulterField[] = [
  {
    name: 'avatars',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 1
  }
];
