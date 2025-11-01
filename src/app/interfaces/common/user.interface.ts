

export interface User {
  _id?: string;
  name?: string;
  username?: string;
  phoneNo?: string;
  email?: string;
  password?: string;
  transactions?: any;
  gender?: string;
  profileImg?: string;
  joinDate?: string;
  user?: any;
  userType?: any;
  designation?: any;
  technologies?: any[];
  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  country?: string;
  countryCode?: string;
  countryName?: string;
  currency?: string;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  data?: any;
  message?: string;
  tokenExpiredIn?: number;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}

export interface UserGroup {
  _id: string;
  data: User[];
}
