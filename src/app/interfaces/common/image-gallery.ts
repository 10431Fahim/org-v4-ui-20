import {ImageFolder} from './image-folder';

export interface ImageGallery {
  _id?: string;
  name: string;
  nameEn: string;
  url: string;
  folder: string | ImageFolder;
}
