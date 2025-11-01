export interface AdditionalPage {
  _id?: string;
  title?: string;
  titleEn?: string;
  slug?: string;
  image?: string;
  seoImage?: string;
  description?: string;
  pageTitle?:string;
  isHtml?: boolean;
  descriptionEn?: string;
  isHtmlEnTitle?: boolean;
  descriptionEnTitle?: string;
  isHtmlTitle?: boolean;
  descriptionTitle?: string;
  pageTitleEn?:string;
  isHtmlEn?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
