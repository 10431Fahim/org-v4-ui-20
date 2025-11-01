/* eslint-disable prettier/prettier */
export interface Seo {
  _id?: string;
  // Seo
  image?:string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  pageName:string;
  createdAt?: Date;
  updatedAt?: Date;
}