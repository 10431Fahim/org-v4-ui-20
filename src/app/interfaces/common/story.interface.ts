import { Technology } from "./technology.interface";

/* eslint-disable prettier/prettier */
export interface Story {
  _id?: string;
  name?: string;
  nameEn?: string;
  image?: string;
  createdBy?: any;
  seoImage?: string;
  shortDescription?: string;
  description?: string;
  shortDescriptionEn?: string;
  descriptionEn?: string;
  offeredServices?: string[];
  technologies?: Technology[];
  industries?: string[];
  slug: string;
  reasonsToChoose?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
