/* eslint-disable prettier/prettier */
export interface MembershipFee {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  // lastName?: string;
  organization?: string;
  committee?: string;
  designation?: string;
  months?: [string];
  others?: string;
  startDate?: string;
  endDate?: string;
  amount?: string;
  email?: string;
  phoneNo?: string;
  companyName?: string;
  shortDesc?: string;
}
