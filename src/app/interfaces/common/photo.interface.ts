/* eslint-disable prettier/prettier */
export interface Photo {
  _id?: string;
  name?: string;
  image?: string;
  images?: string[];
  slug:string;
  createdAt?: Date;
  updatedAt?: Date;
}
