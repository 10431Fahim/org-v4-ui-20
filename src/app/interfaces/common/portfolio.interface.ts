
export interface Portfolio {
  _id?: string;
  name?: string;
  nameEn?: string;
  image?: string;
  seoImage?: string;
  images?: string[];
  leaders?: any[];
  description?: string;
  descriptionEn?: string;
  isHtml?: boolean;
  websiteUrl?:string;
  slug:string;
  createdAt?: Date;
  updatedAt?: Date;
}
