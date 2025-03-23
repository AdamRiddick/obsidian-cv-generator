import { parse } from 'yaml';
import { ContactInfo, ContactProperty, ContentItem, Data, Properties, Section, SubSection } from "../Meta/types";

export const CV_STORAGE_KEY = 'cvData';

export function formatString(input: string) {
  return input
    .replace(/####/g, '')     // Removes all instances of '####'
    .replace(/###/g, '')      // Removes all instances of '###'
    .replace(/##/g, '')       // Removes all instances of '##'
    .replace(/# /g, '')       // Removes all instances of '# '
    .replace(/^-\s/g, '')     // Removes '- ' only at the start of the string
    .replace(/_/g, '')        // Removes all instances of '_'. Note: This means italics are not supported.
    .replace(/\\break/g, '')  // Removes all instances of '\break'
    .replace(/<br>/g, '')     // Removes all instances of '<br>'
    .trim();                  // Trims any leading or trailing whitespace
}

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
      cv.contact.name = formatString(line);
      
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
        i++;
        const [key, value, linkType] = lines[i].replace('- ', '').split(': ');
        if (key.toLowerCase() === 'title') {
          cv.contact.title = formatString(value);
          continue;
        }

        var property: ContactProperty = {
          key: key,
          text: formatString(value),
          linkType: linkType,
        }

        cv.contact.properties.push(property);
      }

      continue;
    }

    if (line.startsWith('## ')) {
      if (currentSection) {
        cv.sections.push(currentSection);
      }
      
      let startOnNewPage = line.includes('\\break');
      currentSection = {
        title: formatString(line),
        subSections: [],
        startOnNewPage: startOnNewPage
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
        content: formatString(line),
        isListItem: isListItem,
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
        const [title, titleRightAligned] = formatString(cleanHeader).split(' | ');
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
      const [secondary, secondaryRight] = formatString(line).split(' | ');
      currentSubSection.subtitle = secondary;
      currentSubSection.subtitleRightAligned = secondaryRight;
      continue;
    }

    if (!line.startsWith('#') && currentSubSection) {
      var isListItem = line.startsWith('- ');
      var contentItem: ContentItem = {
        content: formatString(line),
        isListItem: isListItem,
      }

      currentSubSection.content.push(contentItem);
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

  //Validate contact information
  const requiredContactFields: (keyof ContactInfo)[] = ['name', 'title'];
  requiredContactFields.forEach(field => {
    if (!cv.contact[field]) {
      errors.push(`Missing required contact field: ${field}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
} 