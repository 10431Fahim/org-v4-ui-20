export interface Faq {
  _id?: string;
  name?: string;
  nameEn?: string;
  readOnly?: boolean;
  faqTitle?:String;
  faqTitleEn?:String;
  image?: string;
  seoImage?: string;
  serial?: number;
  description?: string;
  shortDesc?: string;
  isHtml?: boolean;
  descriptionEn?: string;
  shortDescEn?: string;
  isHtmlEn?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  faqCategory?: any;
  title?:string;
  titleEn?:string;
  subFaqs?:SubFaq[];
}



export interface SubFaq {
  faqCategory?: any;
  title: string;
  desc: string;
  titleEn: string;
  descEn: string;
}
