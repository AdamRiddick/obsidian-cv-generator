import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Section as CvSectionType } from '../Meta/types';

export const sectionStyles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 4,
  },
  itemContainer: {
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  sectionTitleText: {
    fontFamily: 'Helvetica-Bold',
  },
  sectionSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#666666',
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  detailsList: {
    marginLeft: 6,
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 10,
    marginBottom: 1,
  },
  bullet: {
    width: 6,
  }
});

interface CvSectionProps {
  section: CvSectionType;
}

export function Section({ section }: CvSectionProps) {
  return (
    <View style={sectionStyles.section} break={section.startOnNewPage}>
      <Text style={sectionStyles.sectionTitle}>{section.title}</Text>
      
      {section.subSections.map((subSection, subSectionIndex) => (
        <View key={subSectionIndex} style={sectionStyles.itemContainer} break={subSection.startOnNewPage}>
          {(subSection.title || subSection.subtitleRightAligned) && (
            <View style={sectionStyles.headerRow}>
              <Text style={sectionStyles.sectionTitleText}>{subSection.title}</Text>
              <Text>{subSection.titleRightAligned}</Text>
            </View>
          )}
          
          {(subSection.subtitle || subSection.subtitleRightAligned) && (
            <View style={sectionStyles.sectionSubtitleRow}>
              <Text>{subSection.subtitle}</Text>
              <Text>{subSection.subtitleRightAligned}</Text>
            </View>
          )}
          
          {subSection && (
            <View style={sectionStyles.detailsList}>
              {subSection.content.map((contentItem, contentIndex) => (
                <View key={contentIndex} style={{ flexDirection: 'row' }}>
                  {contentItem.isListItem && <Text style={sectionStyles.bullet}>• </Text>}
                    <Text style={sectionStyles.detailItem}>
                      {(contentItem.content || '\n').split(/(\*\*.*?\*\*)/g).map((part, index) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <Text key={index} style={{ fontWeight: 'bold' }}>
                            {part.slice(2, -2)}
                          </Text>
                        ) : (
                          <Text key={index}>{part}</Text>
                        )
                      )}
                    </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}