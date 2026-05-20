import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonHeader from '../components/CommonHeader';

const translations = {
  English: {
    pronouns: [
      { source: 'I', kannada: 'ನಾನು', pronunciation: 'Naanu' },
      { source: 'You', kannada: 'ನೀನು', pronunciation: 'Neenu' },
      { source: 'He', kannada: 'ಅವನು', pronunciation: 'Avanu' },
      { source: 'She', kannada: 'ಅವಳು', pronunciation: 'AvaLu' },
      { source: 'We', kannada: 'ನಾವು', pronunciation: 'Naavu' },
      { source: 'They', kannada: 'ಅವರು', pronunciation: 'Avaru' },
    ],
    days: [
      { source: 'Sunday', kannada: 'ಭಾನುವಾರ', pronunciation: 'Bhaanuvaara' },
      { source: 'Monday', kannada: 'ಸೋಮವಾರ', pronunciation: 'Somavaara' },
      { source: 'Tuesday', kannada: 'ಮಂಗಳವಾರ', pronunciation: 'Mangalavaara' },
      { source: 'Wednesday', kannada: 'ಬುಧವಾರ', pronunciation: 'Budhavaara' },
      { source: 'Thursday', kannada: 'ಗುರುವಾರ', pronunciation: 'Guruvaara' },
      { source: 'Friday', kannada: 'ಶುಕ್ರವಾರ', pronunciation: 'Shukravaara' },
      { source: 'Saturday', kannada: 'ಶನಿವಾರ', pronunciation: 'Shanivaara' },
    ],
    months: [
      { source: 'January', kannada: 'ಜನವರಿ', pronunciation: 'Janavari' },
      { source: 'February', kannada: 'ಫೆಬ್ರವರಿ', pronunciation: 'February' },
      { source: 'March', kannada: 'ಮಾರ್ಚ್', pronunciation: 'March' },
      { source: 'April', kannada: 'ಏಪ್ರಿಲ್', pronunciation: 'April' },
      { source: 'May', kannada: 'ಮೇ', pronunciation: 'May' },
      { source: 'June', kannada: 'ಜೂನ್', pronunciation: 'June' },
      { source: 'July', kannada: 'ಜುಲೈ', pronunciation: 'July' },
      { source: 'August', kannada: 'ಆಗಸ್ಟ್', pronunciation: 'August' },
      { source: 'September', kannada: 'ಸೆಪ್ಟೆಂಬರ್', pronunciation: 'September' },
      { source: 'October', kannada: 'ಅಕ್ಟೋಬರ್', pronunciation: 'October' },
      { source: 'November', kannada: 'ನವೆಂಬರ್', pronunciation: 'November' },
      { source: 'December', kannada: 'ಡಿಸೆಂಬರ್', pronunciation: 'December' },
    ],
  },
  Hindi: {
    pronouns: [
      { source: 'मैं', kannada: 'ನಾನು', pronunciation: 'Naanu' },
      { source: 'तुम', kannada: 'ನೀನು', pronunciation: 'Neenu' },
      { source: 'वह (पुरुष)', kannada: 'ಅವನು', pronunciation: 'Avanu' },
      { source: 'वह (महिला)', kannada: 'ಅವಳು', pronunciation: 'AvaLu' },
      { source: 'हम', kannada: 'ನಾವು', pronunciation: 'Naavu' },
      { source: 'वे', kannada: 'ಅವರು', pronunciation: 'Avaru' },
    ],
    days: [
      { source: 'रविवार', kannada: 'ಭಾನುವಾರ', pronunciation: 'Bhaanuvaara' },
      { source: 'सोमवार', kannada: 'ಸೋಮವಾರ', pronunciation: 'Somavaara' },
      { source: 'मंगलवार', kannada: 'ಮಂಗಳವಾರ', pronunciation: 'Mangalavaara' },
      { source: 'बुधवार', kannada: 'ಬುಧವಾರ', pronunciation: 'Budhavaara' },
      { source: 'गुरुवार', kannada: 'ಗುರುವಾರ', pronunciation: 'Guruvaara' },
      { source: 'शुक्रवार', kannada: 'ಶುಕ್ರವಾರ', pronunciation: 'Shukravaara' },
      { source: 'शनिवार', kannada: 'ಶನಿವಾರ', pronunciation: 'Shanivaara' },
    ],
    months: [
      { source: 'जनवरी', kannada: 'ಜನವರಿ', pronunciation: 'Janavari' },
      { source: 'फरवरी', kannada: 'ಫೆಬ್ರವರಿ', pronunciation: 'February' },
      { source: 'मार्च', kannada: 'ಮಾರ್ಚ್', pronunciation: 'March' },
      { source: 'अप्रैल', kannada: 'ಏಪ್ರಿಲ್', pronunciation: 'April' },
      { source: 'मई', kannada: 'ಮೇ', pronunciation: 'May' },
      { source: 'जून', kannada: 'ಜೂನ್', pronunciation: 'June' },
      { source: 'जुलाई', kannada: 'ಜುಲೈ', pronunciation: 'July' },
      { source: 'अगस्त', kannada: 'ಆಗಸ್ಟ್', pronunciation: 'August' },
      { source: 'सितंबर', kannada: 'ಸೆಪ್ಟೆಂಬರ್', pronunciation: 'September' },
      { source: 'अक्टूबर', kannada: 'ಅಕ್ಟೋಬರ್', pronunciation: 'October' },
      { source: 'नवंबर', kannada: 'ನವೆಂಬರ್', pronunciation: 'November' },
      { source: 'दिसंबर', kannada: 'ಡಿಸೆಂಬರ್', pronunciation: 'December' },
    ],
  },
  Bengali: {
    pronouns: [
      { source: 'আমি', kannada: 'ನಾನು', pronunciation: 'Naanu' },
      { source: 'তুমি', kannada: 'ನೀನು', pronunciation: 'Neenu' },
      { source: 'সে (পুরুষ)', kannada: 'ಅವನು', pronunciation: 'Avanu' },
      { source: 'সে (মহিলা)', kannada: 'ಅವಳು', pronunciation: 'AvaLu' },
      { source: 'আমরা', kannada: 'ನಾವು', pronunciation: 'Naavu' },
      { source: 'তারা', kannada: 'ಅವರು', pronunciation: 'Avaru' },
    ],
    days: [
      { source: 'রবিবার', kannada: 'ಭಾನುವಾರ', pronunciation: 'Bhaanuvaara' },
      { source: 'সোমবার', kannada: 'ಸೋಮವಾರ', pronunciation: 'Somavaara' },
      { source: 'মঙ্গলবার', kannada: 'ಮಂಗಳವಾರ', pronunciation: 'Mangalavaara' },
      { source: 'বুধবার', kannada: 'ಬುಧವಾರ', pronunciation: 'Budhavaara' },
      { source: 'বৃহস্পতিবার', kannada: 'ಗುರುವಾರ', pronunciation: 'Guruvaara' },
      { source: 'শুক্রবার', kannada: 'ಶುಕ್ರವಾರ', pronunciation: 'Shukravaara' },
      { source: 'শনিবার', kannada: 'ಶನಿವಾರ', pronunciation: 'Shanivaara' },
    ],
    months: [
      { source: 'জানুয়ারি', kannada: 'ಜನವರಿ', pronunciation: 'Janavari' },
      { source: 'ফেব্রুয়ারি', kannada: 'ಫೆಬ್ರವರಿ', pronunciation: 'February' },
      { source: 'মার্চ', kannada: 'ಮಾರ್ಚ್', pronunciation: 'March' },
      { source: 'এপ্রিল', kannada: 'ಏಪ್ರಿಲ್', pronunciation: 'April' },
      { source: 'মে', kannada: 'ಮೇ', pronunciation: 'May' },
      { source: 'জুন', kannada: 'ಜೂನ್', pronunciation: 'June' },
      { source: 'জুলাই', kannada: 'ಜುಲೈ', pronunciation: 'July' },
      { source: 'আগস্ট', kannada: 'ಆಗಸ್ಟ್', pronunciation: 'August' },
      { source: 'সেপ্টেম্বর', kannada: 'ಸೆಪ್ಟೆಂಬರ್', pronunciation: 'September' },
      { source: 'অক্টোবর', kannada: 'ಅಕ್ಟೋಬರ್', pronunciation: 'October' },
      { source: 'নভেম্বর', kannada: 'ನವೆಂಬರ್', pronunciation: 'November' },
      { source: 'ডিসেম্বর', kannada: 'ಡಿಸೆಂಬರ್', pronunciation: 'December' },
    ],
  },
};

const BasicsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedLanguage = route.params?.language || 'English';
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showKannada, setShowKannada] = useState(false);
  const basics = translations[selectedLanguage] || translations.English;

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const renderCategory = (title, data, category) => (
    <View style={styles.categoryContainer} key={category}>
      <TouchableOpacity 
        style={styles.categoryHeader}
        onPress={() => toggleCategory(category)}
      >
        <Text style={styles.categoryTitle}>{title}</Text>
        <MaterialIcons 
          name={expandedCategory === category ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#555" 
        />
      </TouchableOpacity>
      
      {expandedCategory === category && (
        <View style={styles.categoryContent}>
          {data.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.englishContainer}>
                <Text style={styles.englishText}>{item.source}</Text>
                <Text style={styles.pronunciation}>{item.pronunciation}</Text>
              </View>
              <Text style={styles.kannadaText}>
                {showKannada ? item.kannada : item.pronunciation}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title="Basics" />

      <View style={styles.toggleWrap}>
        <TouchableOpacity 
          onPress={() => setShowKannada(!showKannada)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {showKannada ? 'Show Transliteration' : 'Show Kannada'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderCategory('Pronouns', basics.pronouns, 'pronouns')}
        {renderCategory('Days of the Week', basics.days, 'days')}
        {renderCategory('Months', basics.months, 'months')}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  toggleWrap: {
    padding: 12,
    alignItems: 'flex-end',
  },
  toggleButton: {
    backgroundColor: '#FF3333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFE5E5',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3333',
  },
  categoryContent: {
    padding: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  englishContainer: {
    flex: 1,
  },
  englishText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  pronunciation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  kannadaText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    minWidth: 80,
    textAlign: 'right',
  },
});

export default BasicsScreen;
