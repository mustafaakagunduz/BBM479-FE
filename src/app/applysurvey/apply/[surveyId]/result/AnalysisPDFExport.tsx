// AnalysisPDFExport.tsx
import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface Analysis {
  analysisText: string;
  recommendations: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProfessionMatch {
  id?: number;
  professionId?: number;
  professionName: string;
  matchPercentage: number;
}

interface PDFDocumentProps {
  analysis: Analysis;
  professionMatches: ProfessionMatch[];
}

// PDF stilleri güncellendi
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a365d',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c5282',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  professionMatch: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: '#f7fafc',
  },
  recommendationContainer: {
    marginTop: 10,
  },
  recommendation: {
    marginVertical: 5,
    fontSize: 12,
    paddingLeft: 15,
    lineHeight: 1.6,
  },
  bullet: {
    width: 3,
    height: 3,
    marginRight: 5,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#718096',
    fontSize: 10,
  },
  analysisText: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
});

// Metin temizleme fonksiyonu
const cleanText = (text: string): string => {
  return text
    .replace(/\*\*/g, '') // ** işaretlerini kaldır
    .replace(/^\s*[-•*]\s*/gm, '') // Satır başındaki bullet işaretlerini kaldır
    .trim();
};

const formatAnalysisText = (text: string): string => {
  const sections = text.split(/\n{2,}/);
  return sections
    .map(section => cleanText(section))
    .filter(section => section.length > 0)
    .join('\n\n');
};

// PDF Doküman Bileşeni güncellendi
const AnalysisPDFDocument: React.FC<PDFDocumentProps> = ({ analysis, professionMatches }) => {
  const cleanedAnalysisText = formatAnalysisText(analysis.analysisText);
  const cleanedRecommendations = analysis.recommendations.map(cleanText);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Kariyer Analiz Raporu</Text>
          
          {/* En Uyumlu Meslekler */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>En Uyumlu Meslekler</Text>
            {professionMatches
              .sort((a, b) => b.matchPercentage - a.matchPercentage)
              .slice(0, 3)
              .map((match, index) => (
                <View key={index} style={styles.professionMatch}>
                  <Text style={styles.text}>
                    {index + 1}. {match.professionName}: %{match.matchPercentage.toFixed(1)} Uyum
                  </Text>
                </View>
              ))}
          </View>

          {/* AI Analizi */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>AI Analiz Sonuçları</Text>
            <Text style={styles.analysisText}>{cleanedAnalysisText}</Text>
          </View>

          {/* Öneriler */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Kariyer Önerileri ve Tavsiyeler</Text>
            <View style={styles.recommendationContainer}>
              {cleanedRecommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <Text style={styles.text}>{index + 1}. {rec}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

interface PDFExportProps {
  analysis: Analysis;
  professionMatches: ProfessionMatch[];
}

const AnalysisPDFExport: React.FC<PDFExportProps> = ({ analysis, professionMatches }) => {
  return (
    <div className="mt-4">
      <PDFDownloadLink
        document={<AnalysisPDFDocument analysis={analysis} professionMatches={professionMatches} />}
        fileName={`kariyer-analizi-${new Date().toISOString().split('T')[0]}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <Button
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            {loading ? 'PDF Hazırlanıyor...' : 'PDF Olarak İndir'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default AnalysisPDFExport;