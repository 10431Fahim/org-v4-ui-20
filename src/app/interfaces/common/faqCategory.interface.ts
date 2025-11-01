export interface FaqCategory {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  nameEn?: string;
  image?: string;
  description?: string;
  descriptionEn?: string;
  serial?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  statusEn?: string;
  select?: boolean;
}
