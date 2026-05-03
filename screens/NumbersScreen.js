import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import CommonHeader from '../components/CommonHeader';
import { speakKannada } from '../utils/tts';

const { width } = Dimensions.get('window');

const numbers = {
  '1-20': [
    { english: '1', kannada: 'ಒಂದು', pronunciation: 'Ondu' },
    { english: '2', kannada: 'ಎರಡು', pronunciation: 'Eradu' },
    { english: '3', kannada: 'ಮೂರು', pronunciation: 'Mooru' },
    { english: '4', kannada: 'ನಾಲ್ಕು', pronunciation: 'Nalku' },
    { english: '5', kannada: 'ಐದು', pronunciation: 'Aidu' },
    { english: '6', kannada: 'ಆರು', pronunciation: 'Aaru' },
    { english: '7', kannada: 'ಏಳು', pronunciation: 'ELu' },
    { english: '8', kannada: 'ಎಂಟು', pronunciation: 'EnTu' },
    { english: '9', kannada: 'ಒಂಬತ್ತು', pronunciation: 'Ombattu' },
    { english: '10', kannada: 'ಹತ್ತು', pronunciation: 'Hattu' },
    { english: '11', kannada: 'ಹನ್ನೊಂದು', pronunciation: 'Hannondu' },
    { english: '12', kannada: 'ಹನ್ನೆರಡು', pronunciation: 'Hanneradu' },
    { english: '13', kannada: 'ಹದಿಮೂರು', pronunciation: 'Hadimooru' },
    { english: '14', kannada: 'ಹದಿನಾಲ್ಕು', pronunciation: 'Hadinalku' },
    { english: '15', kannada: 'ಪದಿನೈದು', pronunciation: 'Padinainu' },
    { english: '16', kannada: 'ಹದಿನಾರು', pronunciation: 'Hadināru' },
    { english: '17', kannada: 'ಹದಿನೇಳು', pronunciation: 'Hadinēḷu' },
    { english: '18', kannada: 'ಹದಿನೆಂಟು', pronunciation: 'Hadinenṭu' },
    { english: '19', kannada: 'ಹತ್ತೊಂಬತ್ತು', pronunciation: 'Hattombattu' },
    { english: '20', kannada: 'ಇಪ್ಪತ್ತು', pronunciation: 'Ippattu' },
  ],
  '21-40': [
    { english: '21', kannada: 'ಇಪ್ಪತ್ತೊಂದು', pronunciation: 'Ippattondu' },
    { english: '22', kannada: 'ಇಪ್ಪತ್ತೆರಡು', pronunciation: 'Ippatteradu' },
    { english: '23', kannada: 'ಇಪ್ಪತ್ತಮೂರು', pronunciation: 'Ippattamooru' },
    { english: '24', kannada: 'ಇಪ್ಪತ್ನಾಲ್ಕು', pronunciation: 'Ippatnalku' },
    { english: '25', kannada: 'ಇಪ್ಪತ್ತೈದು', pronunciation: 'Ippattaidu' },
    { english: '26', kannada: 'ಇಪ್ಪತ್ತಾರು', pronunciation: 'Ippattaru' },
    { english: '27', kannada: 'ಇಪ್ಪತ್ತೇಳು', pronunciation: 'Ippattelu' },
    { english: '28', kannada: 'ಇಪ್ಪತ್ತೆಂಟು', pronunciation: 'Ippattentu' },
    { english: '29', kannada: 'ಇಪ್ಪತ್ತೊಂಬತ್ತು', pronunciation: 'Ippattombattu' },
    { english: '30', kannada: 'ಮೂವತ್ತು', pronunciation: 'Muvattu' },
    { english: '31', kannada: 'ಮೂವತ್ತೊಂದು', pronunciation: 'Muvattondu' },
    { english: '32', kannada: 'ಮೂವತ್ತೆರಡು', pronunciation: 'Muvatteradu' },
    { english: '33', kannada: 'ಮೂವತ್ತಮೂರು', pronunciation: 'Muvattamooru' },
    { english: '34', kannada: 'ಮೂವತ್ನಾಲ್ಕು', pronunciation: 'Muvatnalku' },
    { english: '35', kannada: 'ಮೂವತ್ತೈದು', pronunciation: 'Muvattaidu' },
    { english: '36', kannada: 'ಮೂವತ್ತಾರು', pronunciation: 'Muvattaru' },
    { english: '37', kannada: 'ಮೂವತ್ತೇಳು', pronunciation: 'Muvattelu' },
    { english: '38', kannada: 'ಮೂವತ್ತೆಂಟು', pronunciation: 'Muvattentu' },
    { english: '39', kannada: 'ಮೂವತ್ತೊಂಬತ್ತು', pronunciation: 'Muvattombattu' },
    { english: '40', kannada: 'ನಲವತ್ತು', pronunciation: 'Nalavattu' },
  ],
  '41-60': [
    { english: '41', kannada: 'ನಲವತ್ತೊಂದು', pronunciation: 'Nalavattondu' },
    { english: '42', kannada: 'ನಲವತ್ತೆರಡು', pronunciation: 'Nalavatteradu' },
    { english: '43', kannada: 'ನಲವತ್ತಮೂರು', pronunciation: 'Nalavattamooru' },
    { english: '44', kannada: 'ನಲವತ್ತನಾಲ್ಕು', pronunciation: 'Nalavattanalku' },
    { english: '45', kannada: 'ನಲವತ್ತೈದು', pronunciation: 'Nalavattaidu' },
    { english: '46', kannada: 'ನಲವತ್ತಾರು', pronunciation: 'Nalavattaru' },
    { english: '47', kannada: 'ನಲವತ್ತೇಳು', pronunciation: 'Nalavattelu' },
    { english: '48', kannada: 'ನಲವತ್ತೆಂಟು', pronunciation: 'Nalavattyentu' },
    { english: '49', kannada: 'ನಲವತ್ತೊಂಬತ್ತು', pronunciation: 'Nalavattombattu' },
    { english: '50', kannada: 'ಐವತ್ತು', pronunciation: 'Aivattu' },
    { english: '51', kannada: 'ಐವತ್ತೊಂದು', pronunciation: 'Aivattondhu' },
    { english: '52', kannada: 'ಐವತ್ತೆರಡು', pronunciation: 'Aivatteradu' },
    { english: '53', kannada: 'ಐವತ್ತಮೂರು', pronunciation: 'Aivattamooru' },
    { english: '54', kannada: 'ಐವತ್ತನಾಲ್ಕು', pronunciation: 'Aivattanalku' },
    { english: '55', kannada: 'ಐವತ್ತೈದು', pronunciation: 'Aivattaidu' },
    { english: '56', kannada: 'ಐವತ್ತಾರು', pronunciation: 'Aivattaru' },
    { english: '57', kannada: 'ಐವತ್ತೇಳು', pronunciation: 'Aivattelu' },
    { english: '58', kannada: 'ಐವತ್ತೆಂಟು', pronunciation: 'Aivattyentu' },
    { english: '59', kannada: 'ಐವತ್ತೊಂಬತ್ತು', pronunciation: 'Aivattombattu' },
    { english: '60', kannada: 'ಅರವತ್ತು', pronunciation: 'Aravattu' },
  ],
  '61-80': [
    { english: '61', kannada: 'ಅರವತ್ತೊಂದು', pronunciation: 'Aravattondu' },
    { english: '62', kannada: 'ಅರವತ್ತೆರಡು', pronunciation: 'Aravatteradu' },
    { english: '63', kannada: 'ಅರವತ್ತಮೂರು', pronunciation: 'Aravattamooru' },
    { english: '64', kannada: 'ಅರವತ್ತನಾಲ್ಕು', pronunciation: 'Aravattanalku' },
    { english: '65', kannada: 'ಅರವತ್ತೈದು', pronunciation: 'Aravattaidu' },
    { english: '66', kannada: 'ಅರವತ್ತಾರು', pronunciation: 'Aravattaru' },
    { english: '67', kannada: 'ಅರವತ್ತೇಳು', pronunciation: 'Aravattelu' },
    { english: '68', kannada: 'ಅರವತ್ತೆಂಟು', pronunciation: 'Aravattentu' },
    { english: '69', kannada: 'ಅರವತ್ತೊಂಬತ್ತು', pronunciation: 'Aravattombattu' },
    { english: '70', kannada: 'ಎಪ್ಪತ್ತು', pronunciation: 'Eppattu' },
    { english: '71', kannada: 'ಎಪ್ಪತ್ತೊಂದು', pronunciation: 'Eppattondu' },
    { english: '72', kannada: 'ಎಪ್ಪತ್ತೆರಡು', pronunciation: 'Eppatteradu' },
    { english: '73', kannada: 'ಎಪ್ಪತ್ತಮೂರು', pronunciation: 'Eppattamooru' },
    { english: '74', kannada: 'ಎಪ್ಪತ್ತನಾಲ್ಕು', pronunciation: 'Eppattanalku' },
    { english: '75', kannada: 'ಎಪ್ಪತ್ತೈದು', pronunciation: 'Eppattaidu' },
    { english: '76', kannada: 'ಎಪ್ಪತ್ತಾರು', pronunciation: 'Eppattaru' },
    { english: '77', kannada: 'ಎಪ್ಪತ್ತೇಳು', pronunciation: 'Eppattelu' },
    { english: '78', kannada: 'ಎಪ್ಪತ್ತೆಂಟು', pronunciation: 'Eppattentu' },
    { english: '79', kannada: 'ಎಪ್ಪತ್ತೊಂಬತ್ತು', pronunciation: 'Eppattombattu' },
    { english: '80', kannada: 'ಎಂಬತ್ತು', pronunciation: 'Embattu' },
  ],
  '81-100': [
    { english: '81', kannada: 'ಎಂಬತ್ತೊಂದು', pronunciation: 'Embattondhu' },
    { english: '82', kannada: 'ಎಂಬತ್ತೆರಡು', pronunciation: 'Embatteradu' },
    { english: '83', kannada: 'ಎಂಬತ್ತಮೂರು', pronunciation: 'Embattamooru' },
    { english: '84', kannada: 'ಎಂಬತ್ತನಾಲ್ಕು', pronunciation: 'Embattanalku' },
    { english: '85', kannada: 'ಎಂಬತ್ತೈದು', pronunciation: 'Embattaidu' },
    { english: '86', kannada: 'ಎಂಬತ್ತಾರು', pronunciation: 'Embattaru' },
    { english: '87', kannada: 'ಎಂಬತ್ತೇಳು', pronunciation: 'Embattelu' },
    { english: '88', kannada: 'ಎಂಬತ್ತೆಂಟು', pronunciation: 'Embattentu' },
    { english: '89', kannada: 'ಎಂಬತ್ತೊಂಬತ್ತು', pronunciation: 'Embattombattu' },
    { english: '90', kannada: 'ತೊಂಬತ್ತು', pronunciation: 'Thombattu' },
    { english: '91', kannada: 'ತೊಂಬತ್ತೊಂದು', pronunciation: 'Thombattondu' },
    { english: '92', kannada: 'ತೊಂಬತ್ತೆರಡು', pronunciation: 'Thombatteradu' },
    { english: '93', kannada: 'ತೊಂಬತ್ತಮೂರು', pronunciation: 'Thombattamooru' },
    { english: '94', kannada: 'ತೊಂಬತ್ತನಾಲ್ಕು', pronunciation: 'Thombattanalku' },
    { english: '95', kannada: 'ತೊಂಬತ್ತೈದು', pronunciation: 'Thombattaidu' },
    { english: '96', kannada: 'ತೊಂಬತ್ತಾರು', pronunciation: 'Thombattaru' },
    { english: '97', kannada: 'ತೊಂಬತ್ತೇಳು', pronunciation: 'Thombattelu' },
    { english: '98', kannada: 'ತೊಂಬತ್ತೆಂಟು', pronunciation: 'Thombattentu' },
    { english: '99', kannada: 'ತೊಂಬತ್ತೊಂಬತ್ತು', pronunciation: 'Thombattombattu' },
    { english: '100', kannada: 'ನೂರು', pronunciation: 'Nooru' },
  ]
};

const NumbersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('learn');
  const [currentNumber, setCurrentNumber] = useState(1);
  const [showKannada, setShowKannada] = useState(true);
  const [showKannadaInRef, setShowKannadaInRef] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [numberRange, setNumberRange] = useState(100); // Default to 1-100
  const [isRangeModalVisible, setIsRangeModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const numberToKannada = (num) => {
    const numObj = Object.values(numbers).flat().find(n => n.english === num.toString());
    return numObj ? numObj.kannada : num.toString();
  };

  const getPronunciation = (num) => {
    const numObj = Object.values(numbers).flat().find(n => n.english === num.toString());
    return numObj ? numObj.pronunciation : '';
  };

  const speakNumber = async () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    
    const numObj = Object.values(numbers).flat().find(n => n.english === currentNumber.toString());
    if (numObj) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      try {
        setIsSpeaking(true);
        await speakKannada(numObj.kannada);
      } catch (error) {
        console.log('Error speaking:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const generateRandomNumber = () => {
    const randomNum = Math.floor(Math.random() * numberRange) + 1;
    setCurrentNumber(randomNum);
    setIsSpeaking(false);
  };

  const handleRangeChange = (range) => {
    setNumberRange(range);
    const newNum = Math.floor(Math.random() * range) + 1;
    setCurrentNumber(newNum);
    setIsRangeModalVisible(false);
  };

  const openRangeModal = () => {
    setIsRangeModalVisible(true);
  };

  useEffect(() => {
    generateRandomNumber();
  }, []);

  const toggleKannada = () => setShowKannada(!showKannada);

  return (
    <View style={styles.container}>
      <CommonHeader title="Numbers" />

      <View style={styles.subHeader}>
        {activeTab === 'reference' && (
          <TouchableOpacity 
            onPress={() => setShowKannadaInRef(!showKannadaInRef)}
            style={styles.languageToggle}
          >
            <Ionicons 
              name={showKannadaInRef ? 'eye' : 'eye-off'}
              size={24}
              color={showKannadaInRef ? '#FF3333' : '#666'}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'learn' && styles.activeTab]}
          onPress={() => setActiveTab('learn')}
        >
          <MaterialIcons 
            name="casino" 
            size={22} 
            color={activeTab === 'learn' ? '#FF3333' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'learn' && styles.activeTabText]}>
            Learn
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reference' && styles.activeTab]}
          onPress={() => setActiveTab('reference')}
        >
          <MaterialIcons 
            name="list" 
            size={22} 
            color={activeTab === 'reference' ? '#FF3333' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'reference' && styles.activeTabText]}>
            Reference
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'learn' && (
        <View style={styles.learnContainer}>
          <View style={styles.rangeSelector}>
            <TouchableOpacity 
              style={styles.rangeSelectorButton}
              onPress={openRangeModal}
            >
              <Ionicons name="options" size={18} color="#FF6B6B" style={styles.rangeIcon} />
              <Text style={styles.rangeLabel}>Number Range (1-{numberRange})</Text>
              <Ionicons name="chevron-down" size={16} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isRangeModalVisible}
              onRequestClose={() => setIsRangeModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setIsRangeModalVisible(false)}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Number Range</Text>
                <ScrollView style={styles.modalScrollView}>
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.modalButton,
                        numberRange === range && styles.modalButtonActive,
                      ]}
                      onPress={() => handleRangeChange(range)}
                    >
                      <Text style={[
                        styles.modalButtonText,
                        numberRange === range && styles.modalButtonTextActive
                      ]}>
                        1-{range}
                      </Text>
                      {numberRange === range && (
                        <Ionicons name="checkmark" size={20} color="#FF6B6B" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          </View>
          <View style={styles.numberCard}>
            <View style={styles.numberRow}>
              <Text style={styles.numberDisplay}>{currentNumber}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity 
                  style={[styles.iconButton, isSpeaking && styles.iconButtonActive]}
                  onPress={speakNumber}
                >
                  <Ionicons 
                    name={isSpeaking ? 'volume-high' : 'volume-high-outline'} 
                    size={28} 
                    color={isSpeaking ? 'white' : '#666'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.iconButton, showKannada && styles.eyeButtonActive]}
                  onPress={toggleKannada}
                >
                  <Ionicons 
                    name={showKannada ? 'eye' : 'eye-off'} 
                    size={28} 
                    color={showKannada ? 'white' : '#666'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {showKannada && (
              <View style={styles.kannadaContainer}>
                <Text style={styles.kannadaNumber}>
                  {numberToKannada(currentNumber)}
                </Text>
                <Text style={styles.pronunciation}>
                  {getPronunciation(currentNumber)}
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.newNumberButton}
            onPress={generateRandomNumber}
          >
            <Text style={styles.newNumberButtonText}>New Number</Text>
            <MaterialIcons name="casino" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      {activeTab === 'reference' && (
        <ScrollView style={styles.referenceContainer}>
          {Object.entries(numbers).map(([range, numberList]) => (
            <View key={range} style={styles.section}>
              <Text style={styles.sectionTitle}>{range}</Text>
              <View style={styles.numbersGrid}>
                {numberList.map((number, index) => (
                  <View key={`${range}-${index}`} style={styles.refNumberCard}>
                    <View style={styles.refNumberContent}>
                      <Text style={styles.refEnglishNumber}>{number.english}</Text>
                      {showKannadaInRef && (
                        <View style={styles.refKannadaContainer}>
                          <Text style={styles.refKannadaNumber}>{number.kannada}</Text>
                        </View>
                      )}
                                                <Text style={styles.refPronunciation}>{number.pronunciation}</Text>

                    </View>
                    <TouchableOpacity
                      style={styles.refSpeakerButton}
                      onPress={async () => {
                        try {
                          await Speech.speak(number.kannada, { language: 'kn-IN' });
                        } catch (error) {
                          console.log('Error speaking:', error);
                        }
                      }}
                    >
                      <Ionicons name="volume-high-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  rangeSelector: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  rangeSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  rangeIcon: {
    marginRight: 10,
    fontSize: 20,
    color: '#FF6B6B',
  },
  rangeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '60%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  modalButtonActive: {
    backgroundColor: '#FFF5F5',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#4A5568',
  },
  modalButtonTextActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  rangeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
    gap: 8,
  },
  rangeButton: {
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 90,
    height: 46,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  rangeButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: 'rgba(255, 107, 107, 0.3)',
    transform: [{ translateY: -2 }],
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    width: '100%',
  },
  rangeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 24,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 3,
  },
  learnContainer: {
    flex: 1,
    padding: 15,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F9FA',
  },
  languageToggle: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF3333',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF3333',
    fontWeight: '600',
  },
  learnContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  numberCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  numberDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 80,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  iconButtonActive: {
    backgroundColor: '#FF3333',
  },
  eyeButtonActive: {
    backgroundColor: '#FF3333',
  },
  kannadaContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  kannadaNumber: {
    fontSize: 32,
    marginVertical: 8,
    color: '#FF3333',
    fontWeight: '600',
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  newNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  newNumberButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  referenceContainer: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 5,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  refNumberCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refNumberContent: {
    flex: 1,
  },
  refEnglishNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refKannadaContainer: {
    marginTop: 4,
  },
  refKannadaNumber: {
    fontSize: 16,
    color: '#FF3333',
  },
  refPronunciation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  refSpeakerButton: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  languageToggle: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  languageToggleInactive: {
    backgroundColor: '#f5f5f5',
  },
  languageToggleText: {
    fontSize: 12,
    color: '#666',
  },
  languageToggleTextInactive: {
    color: '#999',
  },
});

export default NumbersScreen;