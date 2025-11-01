export interface Category {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  nameEn?: string;
  slug?: string;
  image?: string;
  description?: string;
  descriptionEn?: string;
  serial?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  select?: boolean;
}
