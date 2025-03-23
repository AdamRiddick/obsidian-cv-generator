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
  return (
      <View style={contactCardStyles.contactRow}>
        {properties.map((property, index) => (
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
  );
}