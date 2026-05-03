import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonHeader from '../components/CommonHeader';

const basics = {
  pronouns: [
    { english: 'I', kannada: 'ನಾನು', pronunciation: 'Naanu' },
    { english: 'You', kannada: 'ನೀನು', pronunciation: 'Neenu' },
    { english: 'He', kannada: 'ಅವನು', pronunciation: 'Avanu' },
    { english: 'She', kannada: 'ಅವಳು', pronunciation: 'AvaLu' },
    { english: 'We', kannada: 'ನಾವು', pronunciation: 'Naavu' },
    { english: 'They', kannada: 'ಅವರು', pronunciation: 'Avaru' },
  ],
  days: [
    { english: 'Sunday', kannada: 'ಭಾನುವಾರ', pronunciation: 'Bhaanuvaara' },
    { english: 'Monday', kannada: 'ಸೋಮವಾರ', pronunciation: 'Somavaara' },
    { english: 'Tuesday', kannada: 'ಮಂಗಳವಾರ', pronunciation: 'Mangalavaara' },
    { english: 'Wednesday', kannada: 'ಬುಧವಾರ', pronunciation: 'Budhavaara' },
    { english: 'Thursday', kannada: 'ಗುರುವಾರ', pronunciation: 'Guruvaara' },
    { english: 'Friday', kannada: 'ಶುಕ್ರವಾರ', pronunciation: 'Shukravaara' },
    { english: 'Saturday', kannada: 'ಶನಿವಾರ', pronunciation: 'Shanivaara' },
  ],
  months: [
    { english: 'January', kannada: 'ಜನವರಿ', pronunciation: 'Janavari' },
    { english: 'February', kannada: 'ಫೆಬ್ರವರಿ', pronunciation: 'February' },
    { english: 'March', kannada: 'ಮಾರ್ಚ್', pronunciation: 'March' },
    { english: 'April', kannada: 'ಏಪ್ರಿಲ್', pronunciation: 'April' },
    { english: 'May', kannada: 'ಮೇ', pronunciation: 'May' },
    { english: 'June', kannada: 'ಜೂನ್', pronunciation: 'June' },
    { english: 'July', kannada: 'ಜುಲೈ', pronunciation: 'July' },
    { english: 'August', kannada: 'ಆಗಸ್ಟ್', pronunciation: 'August' },
    { english: 'September', kannada: 'ಸೆಪ್ಟೆಂಬರ್', pronunciation: 'September' },
    { english: 'October', kannada: 'ಅಕ್ಟೋಬರ್', pronunciation: 'October' },
    { english: 'November', kannada: 'ನವೆಂಬರ್', pronunciation: 'November' },
    { english: 'December', kannada: 'ಡಿಸೆಂಬರ್', pronunciation: 'December' },
  ],
};

const BasicsScreen = () => {
  const navigation = useNavigation();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showKannada, setShowKannada] = useState(false);

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
                <Text style={styles.englishText}>{item.english}</Text>
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
