import { parse } from 'yaml';
import { ContactInfo, ContactProperty, ContentItem, Data, Properties, Section, SubSection } from "../Meta/types";

export const CV_STORAGE_KEY = 'cvData';

export function parseYamlFrontmatter(markdown: string): { properties: Properties, content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { properties: {}, content: markdown };
  }

  const [, frontmatter, content] = match;
  
  try {
    const properties = parse(frontmatter) as Properties;
    return { 
      properties: properties || {}, 
      content: content.trim() 
    };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { properties: {}, content: markdown };
  }
}

export function markdownToCv(markdown: string): Data {
  const { properties, content } = parseYamlFrontmatter(markdown);
  const lines = content.split('\n').filter(line => line.trim());
  const cv: Data = {
    properties: Object.keys(properties).length > 0 ? properties : undefined,
    contact: {
      name: '',
      title: '',
      properties: []
    },
    sections: []
  };

  let currentSection: Section | null = null;
  let currentSubSection: SubSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      cv.contact.name = line.replace('# ', '');
      
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
        i++;
        const [key, value, linkType, url] = lines[i].replace('- ', '').split(': ');
          var property: ContactProperty = {
            key: key,
            text: value,
            linkType: linkType,
            url: url
          }

          cv.contact.properties.push(property);
      }

      continue;
    }

    if (line.startsWith('## ')) {
      if (currentSection) {
        cv.sections.push(currentSection);
      }
      
      const title = line.replace('## ', '');
      currentSection = {
        title: title.replace('\\break', '').trim(),
        subSections: [],
        startOnNewPage: title.includes('\\break')
      };
      currentSubSection = null;
      continue;
    }
    if (!line.startsWith('#') && currentSection && !currentSubSection) {
      currentSubSection = {
        content: []
      };

      var isListItem = line.startsWith('- ');
      var contentItem: ContentItem = {
        content: line.replace('- ', ''),
        isListItem: isListItem
      }

      currentSubSection.content.push(contentItem);
      currentSection.subSections.push(currentSubSection);
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentSection) {
        const headerLine = line.replace('### ', '');
        const hasBreak = headerLine.endsWith('\\break');
        const cleanHeader = hasBreak ? headerLine.slice(0, -6).trim() : headerLine;
        const [title, titleRightAligned] = cleanHeader.split(' | ');
        currentSubSection = {
          title,
          titleRightAligned,
          content: [],
          startOnNewPage: hasBreak
        };
        currentSection.subSections.push(currentSubSection);
      }
      continue;
    }

    if (line.startsWith('#### ') && currentSubSection) {
      const [secondary, secondaryRight] = line.replace('#### ', '').split(' | ');
      currentSubSection.subtitle = secondary;
      currentSubSection.subtitleRightAligned = secondaryRight;
      continue;
    }

    if (!line.startsWith('#') && currentSubSection) {
      var isListItem = line.startsWith('- ');
      var contentItem: ContentItem = {
        content: line.replace('- ', ''),
        isListItem: isListItem
      }
      continue;
    }
  }

  if (currentSection) {
    cv.sections.push(currentSection);
  }

  return cv;
}

export function validateCvMarkdown(markdown: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { content } = parseYamlFrontmatter(markdown);
  
  // Validate that content starts with a level 1 heading (#)
  const firstNonEmptyLine = content.split('\n').find(line => line.trim());
  if (!firstNonEmptyLine?.startsWith('# ')) {
    errors.push('CV must start with a level 1 heading (#) containing the name');
  }

  const cv = markdownToCv(markdown);

  // Validate contact information
  const requiredContactFields: (keyof ContactInfo)[] = ['name', 'title'];
  requiredContactFields.forEach(field => {
    if (!cv.contact[field]) {
      errors.push(`Missing required contact field: ${field}`);
    }
  });

  // // Validate sections
  // if (!cv.sections.length) {
  //   errors.push('CV must have at least one section');
  // }

  // // Validate each section has a title and at least one item
  // cv.sections.forEach((section, index) => {
  //   if (!section.title) {
  //     errors.push(`Section ${index + 1} is missing a title`);
  //   }
  //   if (!section.items.length) {
  //     errors.push(`Section "${section.title || index + 1}" must have at least one item`);
  //   }
  // });

  return {
    isValid: errors.length === 0,
    errors
  };
} 