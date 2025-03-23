import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { Section } from './Section';
import { Data } from '../Meta/types';
import { ContactCard } from './ContactCard';

export const documentStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  viewer: {
    width: '100%',
    height: '100vh',
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333333',
    fontFamily: 'Helvetica',
  }
});
  
export const CvDocument = ({ cvData }: { cvData: Data }) => {
  return (
    <Document>
      <Page size="A4" style={documentStyles.page}>
        <View style={documentStyles.header}>
          <Text style={documentStyles.name}>{cvData.contact.name}</Text>
          <Text style={documentStyles.title}>{cvData.contact.title}</Text>
          <ContactCard properties={cvData.contact.properties} />
        </View>
        {cvData.sections.map((section, index) => (
          <Section key={index} section={section} />
        ))}
      </Page>
    </Document>
  );
};