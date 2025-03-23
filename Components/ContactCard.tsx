import { Fragment } from 'react';
import { StyleSheet, View, Text, Link } from '@react-pdf/renderer';
import { ContactProperty } from '../Meta/types';

export const contactCardStyles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
    fontSize: 10,
  },
  contactText: {
    color: '#333333',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  bullet: {
    color: '#333333',
    paddingHorizontal: 2,
    fontSize: 10,
  }
});

interface CvSectionProps {
  properties: ContactProperty[];
}

export function ContactCard({ properties }: CvSectionProps) {
  // Group properties into chunks of 3
  const groupedProperties = properties.reduce((rows: any[][], property, index) => {
    if (index % 3 === 0) {
      rows.push([property]);
    } else {
      rows[rows.length - 1].push(property);
    }
    return rows;
  }, []);

  return (
    <>
      {groupedProperties.map((group, rowIndex) => (
        <View key={rowIndex} style={contactCardStyles.contactRow}>
          {group.map((property, index) => (
            <Fragment key={index}>
              {index > 0 && <Text style={contactCardStyles.bullet}>•</Text>}
              <Text>{`${property.key}: `}</Text>
              {property.linkType ? (
                <Link src={`${property.linkType}${property.text}`} style={contactCardStyles.contactText}>
                  {property.text}
                </Link>
              ) : (
                <Text style={contactCardStyles.contactText}>{property.text}</Text>
              )}
            </Fragment>
          ))}
        </View>
      ))}
    </>
  );
}
