import {Category} from './category.interface';

export interface FaqSubCategory {
  _id?: string;
  readOnly?: boolean;
  category?: string | Category;
  categoryInfo?: Category;
  name?: string;
  nameEn?: string;
  slug?: string;
  image?: string;
  priority?: number;
  status?: string;
  statusEn?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
