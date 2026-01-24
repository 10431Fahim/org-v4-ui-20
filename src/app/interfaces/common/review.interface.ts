/* eslint-disable prettier/prettier */
export interface Review {
  _id?: string;
  name?: string;
  nameEn?: string;
  image?: string;
  image2?: string;
 seoImage?: string;
  title?: string;
  shortDescription?:string;
  description?: string;
  titleEn?: string;
  shortDescriptionEn?:string;
  descriptionEn?: string;
  location?: string;
  locationEn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
