export interface InformationItem {
  url?: string;
  image?: string;
  name?: string;
  nameEn?: string;
  descriptionEn?: string;
  description?: string;
}

export interface About {
  _id?: string;
  name?: any;
  nameEn?: any;
  image?: any;
  seoImage?: string;
  briefTimelineImg?: string;
  briefTimelineImgEn?: string;
  images?: string[];
  informations?: InformationItem[];
  description?: string;
  isHtml?: boolean;
  descriptionEn?: string;
  isHtmlEn?: boolean;
  websiteUrl?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
