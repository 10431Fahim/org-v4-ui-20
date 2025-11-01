/* eslint-disable prettier/prettier */
export interface Review {
  _id?: string;
  customerId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  priority?: number;
  complainSubject?: string;
  orderID?: string;
  complainDetail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
