import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Colors
const COLORS = {
  primary: '#FF3333',
  secondary: '#FF6B6B',
  accent: '#4CAF50',
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  lightGray: '#E9ECEF',
  cardBorder: 'rgba(0,0,0,0.06)',
};


const HomeScreen = () => {
  const navigation = useNavigation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const courseCards = [
    {
      id: 'basics',
      title: 'Basics',
      titleKannada: 'ಮೂಲಾಂಗಗಳು',
      subtitle: 'Essential words',
      icon: 'chat',
      iconType: 'MaterialIcons',
      iconBg: '#4CAF50',
      cardBg: '#F5F3FF',
      screen: 'Basics',
    },
    {
      id: 'numbers',
      title: 'Numbers',
      titleKannada: 'ಸಂಖ್ಯೆಗಳು',
      subtitle: 'Learn to count',
      icon: 'dialpad',
      iconType: 'MaterialIcons',
      iconBg: '#2196F3',
      cardBg: '#EAF2FF',
      screen: 'Numbers',
    },
    {
      id: 'grammar',
      title: 'Grammar',
      titleKannada: 'ವ್ಯಾಕರಣ',
      subtitle: 'Learn grammar rules',
      icon: 'spellcheck',
      iconType: 'MaterialIcons',
      iconBg: '#9333EA',
      cardBg: '#E9F7EC',
      screen: 'Grammar',
    },
    {
      id: 'lessons',
      title: 'Lessons',
      titleKannada: 'ಪಾಠಗಳು',
      subtitle: 'Structured learning',
      icon: 'school',
      iconType: 'MaterialIcons',
      iconBg: '#FF6B6B',
      cardBg: '#FFF0F0',
      screen: 'LessonList',
    },
    {
      id: 'conversations',
      title: 'Conversations',
      titleKannada: 'ಸಂಭಾಷಣೆಗಳು',
      subtitle: 'Common dialogues',
      icon: 'forum',
      iconType: 'MaterialIcons',
      iconBg: '#9C27B0',
      cardBg: '#F3E5F5',
      screen: 'ConversationList',
    },
    {
      id: 'ai-practice',
      title: 'AI Practice',
      titleKannada: 'AI ಪ್ರಾಕ್ಟೀಸ್',
      subtitle: 'Practice with AI',
      icon: 'smart-toy',
      iconType: 'MaterialIcons',
      iconBg: '#FF9800',
      cardBg: '#FFF3E0',
      screen: 'ConversationPractice',
    },
  ];

  const renderCourseIcon = (item) => {
    // UX-matching icons for Basics, Numbers, Grammar
    if (item.id === 'basics') {
      return <MaterialIcons name="language" size={30} color={COLORS.white} />;
    }
    if (item.id === 'numbers') {
      return <MaterialIcons name="looks-one" size={32} color={COLORS.white} />;
    }
    if (item.id === 'grammar') {
      return <MaterialIcons name="menu-book" size={28} color={COLORS.white} />;
    }
    if (item.iconType === 'MaterialIcons') {
      return <MaterialIcons name={item.icon} size={32} color={COLORS.white} />;
    }
    if (item.iconType === 'FontAwesome5') {
      return <FontAwesome5 name={item.icon} size={32} color={COLORS.white} />;
    }
    if (item.iconType === 'Feather') {
      return <Feather name={item.icon} size={32} color={COLORS.white} />;
    }
    return <MaterialIcons name={item.icon} size={32} color={COLORS.white} />;
  };

  const CourseCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.CompactCard, { backgroundColor: item.cardBg }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.85}
    >
      <View style={[styles.CompactIconWrap, { backgroundColor: item.iconBg }]}>
        {renderCourseIcon(item)}
      </View>

      <View style={styles.CompactTextCol}>
        <Text style={styles.CompactTitleEnglish}>{item.title}</Text>
        <Text style={styles.CompactSubtitle}>{item.subtitle}</Text>
      </View>

      {item.id === 'grammar' && (
        <View style={styles.GrammarDecoration}>
           <View style={styles.notepad}>
              <View style={styles.notepadSpiral}>
                 {[1,2,3,4,5].map(i => <View key={i} style={styles.spiralDot} />)}
              </View>
              <View style={styles.notepadContent}>
                 <View style={[styles.notepadLine, {width: '80%', backgroundColor: '#FEE2E2'}]} />
                 <View style={[styles.notepadLine, {width: '90%', backgroundColor: '#FEE2E2'}]} />
                 <View style={[styles.notepadLine, {width: '70%', backgroundColor: '#FEE2E2'}]} />
              </View>
           </View>
           <View style={styles.pencil}>
              <View style={styles.pencilTip} />
           </View>
        </View>
      )}
      {item.id === 'basics' && (
        <View style={styles.BasicsDecoration}>
           <View style={styles.paperStack}>
              <View style={[styles.paperBack, {transform: [{rotate: '-8deg'}], top: -2}]} />
              <View style={[styles.paperBack, {transform: [{rotate: '-4deg'}], top: 0}]} />
              <View style={styles.paperFront}>
                 <Text style={styles.paperText}>ನಮಸ್ಕಾರ</Text>
                 <Text style={styles.paperTextEnglish}>Namaskara</Text>
              </View>
           </View>
           <View style={styles.plantInPot}>
              <View style={styles.pot} />
              <View style={styles.plantLeaf} />
              <View style={styles.plantLeaf2} />
           </View>
        </View>
      )}
      {item.id === 'numbers' && (
        <View style={styles.NumbersDecoration}>
           <View style={[styles.block3d, {backgroundColor: '#3B82F6', top: 0, left: 18, zIndex: 2}]}>
              <Text style={styles.blockText}>1</Text>
           </View>
           <View style={[styles.block3d, {backgroundColor: '#FBBF24', bottom: 5, left: 0}]}>
              <Text style={styles.blockText}>2</Text>
           </View>
           <View style={[styles.block3d, {backgroundColor: '#EF4444', bottom: 5, right: 0}]}>
              <Text style={styles.blockText}>3</Text>
           </View>
        </View>
      )}
      {item.id === 'conversations' && (
        <View style={styles.CompactDecoration}>
           <MaterialIcons name="forum" size={45} color={item.iconBg} opacity={0.15} />
        </View>
      )}
      {item.id === 'ai-practice' && (
        <View style={styles.CompactDecoration}>
           <FontAwesome5 name="robot" size={40} color={item.iconBg} opacity={0.15} />
        </View>
      )}

      <View style={styles.CompactArrowWrap}>
        <MaterialIcons name="chevron-right" size={24} color="#4B5563" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground source={require('../assets/images/header.jpg')} style={styles.hero} resizeMode="contain">
          <View style={styles.heroTopRow}>
            <View style={styles.pillButton}>
              <Feather name="eye" size={18} color={COLORS.black} />
              <Text style={styles.pillText}>ಕನ್ನಡ</Text>
            </View>

            <View style={styles.heroRightGroup}>
              <View style={styles.pillButton}>
                <Image source={require('../assets/images/favicon.png')} style={styles.flagIconSmall} />
                <Text style={styles.pillText}>
                  {selectedLanguage === 'English' ? 'EN' : selectedLanguage === 'Hindi' ? 'HI' : 'BN'}
                </Text>
              </View>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
                <Feather name="bell" size={18} color={COLORS.black} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={() => setShowLanguageMenu(true)}>
                <Feather name="more-vertical" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroBottomSpacer} />
        </ImageBackground>

        <View style={styles.contentWrapper}>
          <View style={styles.courseList}>
            {courseCards.map(CourseCard)}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Live Session Banner at Bottom */}
      <TouchableOpacity style={styles.liveBannerFixed} activeOpacity={0.9} onPress={() => setShowRegistrationModal(true)}>
        <View style={styles.liveBannerContent}>
          <View style={styles.liveBannerLeft}>
            <View style={styles.liveBadgeRowFixed}>
              <View style={styles.liveBadgeSmall}>
                <View style={styles.liveDotSmall} />
                <Text style={styles.liveBadgeTextSmall}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.liveBannerTitleFixed}>1-1 Live Sessions</Text>
            <View style={styles.liveDetailsRow}>
              <View style={styles.liveDetailItem}>
                <MaterialIcons name="schedule" size={14} color="#6C757D" />
                <Text style={styles.liveDetailTextSmall}>20m/day</Text>
              </View>
              <View style={styles.liveDetailItem}>
                <MaterialIcons name="calendar-today" size={14} color="#6C757D" />
                <Text style={styles.liveDetailTextSmall}>3d/week</Text>
              </View>
            </View>
            <View style={styles.liveDetailsRow}>
              <View style={styles.liveDetailItem}>
                <MaterialIcons name="school" size={14} color="#6C757D" />
                <Text style={styles.liveDetailTextSmall}>15 Sessions</Text>
              </View>
              <View style={styles.liveDetailItem}>
                <MaterialIcons name="currency-rupee" size={14} color="#4CAF50" />
                <Text style={styles.livePriceTextSmall}>3,000/-</Text>
              </View>
            </View>
          </View>
          <View style={styles.liveBannerRight}>
            <View style={styles.humanIconWrap}>
              <MaterialIcons name="support-agent" size={50} color="#4CAF50" />
              <View style={styles.headsetIndicator}>
                <MaterialIcons name="headset-mic" size={20} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.registerNowBadge}>
              <Text style={styles.registerNowText}>Register</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageMenu}
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {['English', 'Bengali', 'Hindi'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.languageOption, selectedLanguage === lang && styles.languageOptionSelected]}
                onPress={() => {
                  setSelectedLanguage(lang);
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[styles.languageOptionText, selectedLanguage === lang && styles.languageOptionTextSelected]}>
                  {lang}
                </Text>
                {selectedLanguage === lang && (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageMenu(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Registration Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRegistrationModal}
        onRequestClose={() => setShowRegistrationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.registrationModalContent}>
            <Text style={styles.modalTitle}>Register for Live Session</Text>
            <Text style={styles.registrationSubtitle}>1-1 Session | 20 mins/day | 3 days/week | 15 Sessions | ₹3,000/-</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your name"
                value={registrationForm.name}
                onChangeText={(text) => setRegistrationForm({...registrationForm, name: text})}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={registrationForm.email}
                onChangeText={(text) => setRegistrationForm({...registrationForm, email: text})}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={registrationForm.phone}
                onChangeText={(text) => setRegistrationForm({...registrationForm, phone: text})}
              />
            </View>

            <TouchableOpacity
              style={styles.registerSubmitButton}
              onPress={() => {
                alert(`Registration submitted!\n\nName: ${registrationForm.name}\nEmail: ${registrationForm.email}\nPhone: ${registrationForm.phone}`);
                setShowRegistrationModal(false);
                setRegistrationForm({name: '', email: '', phone: ''});
              }}
            >
              <Text style={styles.registerSubmitText}>Submit Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRegistrationModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    paddingBottom: 140,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    width: width,
    height: width * 0.5625, // Assuming 16:9 aspect ratio
    backgroundColor: '#fff',
  },
  heroTopRow: {
    paddingTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroBottomSpacer: {
    flex: 1,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  flagIconSmall: {
    width: 18,
    height: 12,
    borderRadius: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.black,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },

  lessonCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 4,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  lessonIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  lessonIconImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  lessonTextCol: {
    flex: 1,
  },
  lessonCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#9A3412',
  },
  lessonSubtitle: {
    fontSize: 12,
    color: '#7C2D12',
    fontWeight: '500',
  },
  progressRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressTrackSmall: {
    width: 60,
    height: 5,
    backgroundColor: '#FED7AA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 10,
  },
  lessonProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C2D12',
  },
  lessonChevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  courseList: {
    marginTop: 16,
    gap: 12,
  },
  CompactCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    height: 110,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  basicsIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapperLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapperRight: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleTextLeft: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    top: 6,
  },
  bubbleTextRight: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    top: 5,
  },
  numbersIconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number1: {
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  number2: {
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  number3: {
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  grammarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  grammarCharOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#9333EA',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  grammarChar: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  BasicsDecoration: {
    position: 'absolute',
    right: 55,
    top: '50%',
    marginTop: -40,
    width: 100,
    height: 80,
  },
  paperStack: {
    width: 60,
    height: 75,
  },
  paperBack: {
    position: 'absolute',
    width: 60,
    height: 75,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  paperFront: {
    width: 60,
    height: 75,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  paperText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paperTextEnglish: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  plantInPot: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    alignItems: 'center',
  },
  pot: {
    width: 20,
    height: 18,
    backgroundColor: '#D97706',
    borderRadius: 4,
  },
  plantLeaf: {
    width: 6,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 3,
    position: 'absolute',
    top: -10,
    left: 2,
    transform: [{rotate: '-20deg'}],
  },
  plantLeaf2: {
    width: 6,
    height: 12,
    backgroundColor: '#059669',
    borderRadius: 3,
    position: 'absolute',
    top: -12,
    right: 2,
    transform: [{rotate: '20deg'}],
  },
  NumbersDecoration: {
    position: 'absolute',
    right: 65,
    top: '50%',
    marginTop: -35,
    width: 70,
    height: 70,
  },
  block3d: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  blockText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  GrammarDecoration: {
    position: 'absolute',
    right: 60,
    top: '50%',
    marginTop: -40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notepad: {
    width: 55,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  notepadSpiral: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: -4,
    left: 8,
    right: 8,
  },
  spiralDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
  },
  notepadContent: {
    marginTop: 6,
    gap: 6,
  },
  notepadLine: {
    height: 4,
    borderRadius: 2,
  },
  pencil: {
    position: 'absolute',
    width: 8,
    height: 45,
    backgroundColor: '#FBBF24',
    right: -2,
    bottom: 5,
    borderRadius: 2,
    transform: [{rotate: '-15deg'}],
    borderWidth: 1,
    borderColor: '#D97706',
    zIndex: 5,
  },
  pencilTip: {
    position: 'absolute',
    top: -6,
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  CompactArrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  CompactIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  CompactTextCol: {
    flex: 1,
    zIndex: 2,
  },
  CompactTitleEnglish: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  CompactSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  CompactSubtitleKannada: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  CompactProgressRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  CompactProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  CompactProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  CompactProgressText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  CompactDecoration: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -20,
    opacity: 0.15,
  },
  courseIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  courseTextCol: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111827',
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  courseSubtitleKannada: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: 2,
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'column',
    gap: 4,
  },
  progressTrack: {
    width: '70%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
  },
  courseChevronWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  liveCard: {
    marginTop: 16,
    backgroundColor: '#FFFBF5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
  },
  liveTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  liveBadgeText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  liveTeacherText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  liveSubtitle: {
    marginTop: 10,
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  liveBottomRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  liveMeta: {
    flex: 1,
    gap: 12,
  },
  nextSessionBadge: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  nextSessionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
  },
  sessionTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sessionTimeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  learnerGroup: {
    flexDirection: 'column',
    gap: 6,
  },
  learnerAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  learnerCount: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 13,
  },

  statsRow: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '900',
    marginTop: 1,
  },
  liveBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  liveBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  liveBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveBadgeTextSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  liveBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  liveDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDetailText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  livePriceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  liveBannerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  liveBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBannerLeft: {
    flex: 1,
  },
  liveBadgeRowFixed: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  liveBannerTitleFixed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  liveDetailTextSmall: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  livePriceTextSmall: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  liveBannerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  humanIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E9F7EC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  headsetIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  registerNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  registerNowText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageOptionSelected: {
    backgroundColor: '#FFE5E5',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  languageOptionTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  modalCloseText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  registrationModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
  },
  registrationSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  registerSubmitButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  registerSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
