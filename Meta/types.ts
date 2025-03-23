export interface Data {
  properties?: Properties;
  contact: ContactInfo;
  sections: Section[];
}

export interface Properties {
  [key: string]: string | string[] | undefined;
}

export interface Section {
  title: string;
  subSections: SubSection[];
  startOnNewPage?: boolean;
}

export interface SubSection {
  title?: string;
  titleRightAligned?: string;
  subtitle?: string;
  subtitleRightAligned?: string;
  content: ContentItem[];
  startOnNewPage?: boolean;
}

export interface ContentItem {
  content: string
  isListItem?: boolean
}

export interface ContactInfo {
  name: string;
  title: string;
  properties: ContactProperty[]
}

export interface ContactProperty {
  key: string
  text: string
  linkType: string
  url?: string
}