export interface Popup {
  _id?: string;
  readOnly?: boolean;
  title?: string;
  image?: string;
  url?: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
   //if want to show susbscription in your ad
   enableSubscription?: boolean;
   isActive?: boolean;
}
