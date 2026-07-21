import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(WINDOW_WIDTH, 390);
const resolveApiBase = () => {
  if (typeof window === 'undefined') return 'https://dromominds.com/apps';
  const { hostname, origin } = window.location;
  // Render / production → same-origin Express API (emails moktarul@gmail.com)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `${origin}/api`;
  }
  // Local Expo web → existing PHP host
  return 'https://dromominds.com/apps';
};

const API_BASE = resolveApiBase();

const COLORS = {
  primary: '#E8392B',
  ink: '#1A1210',
  cream: '#FFF8F3',
  sand: '#F3E7DC',
  muted: '#6B5E57',
  white: '#FFFFFF',
  success: '#2F9E5F',
};

const DAILY_WORDS = [
  { english: 'Water', kannada: 'ನೀರು', pronunciation: 'Neeru', emoji: '💧' },
  { english: 'Food', kannada: 'ಆಹಾರ', pronunciation: 'Aahara', emoji: '🍛' },
  { english: 'Hello', kannada: 'ನಮಸ್ಕಾರ', pronunciation: 'Namaskara', emoji: '🙏' },
  { english: 'Thank you', kannada: 'ಧನ್ಯವಾದ', pronunciation: 'Dhanyavaada', emoji: '🙏' },
  { english: 'Beautiful', kannada: 'ಸುಂದರ', pronunciation: 'Sundara', emoji: '🌸' },
  { english: 'Love', kannada: 'ಪ್ರೀತಿ', pronunciation: 'Preeti', emoji: '❤️' },
  { english: 'Home', kannada: 'ಮನೆ', pronunciation: 'Mane', emoji: '🏠' },
];

const DAILY_SENTENCES = [
  { english: 'How are you?', kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', pronunciation: 'Neevu heegiddeeri?' },
  { english: 'My name is...', kannada: 'ನನ್ನ ಹೆಸರು...', pronunciation: 'Nanna hesaru...' },
  { english: 'Where is the bus stop?', kannada: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', pronunciation: 'Bus nildaana ellide?' },
  { english: 'I want to learn Kannada.', kannada: 'ನಾನು ಕನ್ನಡ ಕಲಿಯಲು ಬಯಸುತ್ತೇನೆ.', pronunciation: 'Naanu Kannada kaliyalu bayasutteene.' },
  { english: 'What is the price?', kannada: 'ಬೆಲೆ ಎಷ್ಟು?', pronunciation: 'Bele eshtu?' },
  { english: 'Please help me.', kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.', pronunciation: 'Dayaviṭṭu nanage sahaaya maadi.' },
  { english: 'Good morning!', kannada: 'ಶುಭ ಮುಂಜಾನೆ!', pronunciation: 'Shubha munjane!' },
];

const COURSE_CARDS = [
  { id: 'basics', title: 'Basics', subtitle: 'Essential words', icon: 'language', iconBg: '#2F9E5F', screen: 'Basics' },
  { id: 'numbers', title: 'Numbers', subtitle: 'Learn to count', icon: 'looks-one', iconBg: '#2B6CB0', screen: 'Numbers' },
  { id: 'grammar', title: 'Grammar', subtitle: 'Core rules', icon: 'menu-book', iconBg: '#B45309', screen: 'Grammar' },
  { id: 'lessons', title: 'Lessons', subtitle: 'Structured path', icon: 'school', iconBg: '#E8392B', screen: 'LessonList' },
  { id: 'conversations', title: 'Conversations', subtitle: 'Real dialogues', icon: 'forum', iconBg: '#7C3AED', screen: 'ConversationList' },
  { id: 'ai-practice', title: 'AI Practice', subtitle: 'Speak with AI', icon: 'smart-toy', iconBg: '#C2410C', screen: 'ConversationPractice' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [streak] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isDailySentence, setIsDailySentence] = useState(false);
  const [dailyIndex, setDailyIndex] = useState(new Date().getDay());
  const [showMeaning, setShowMeaning] = useState(false);
  const autoRotateRef = useRef(null);
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroRise = useRef(new Animated.Value(18)).current;

  const dailyList = isDailySentence ? DAILY_SENTENCES : DAILY_WORDS;
  const dailyItem = dailyList[Math.abs(dailyIndex) % dailyList.length];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(heroRise, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();
  }, [heroFade, heroRise]);

  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      setDailyIndex((i) => i + 1);
      setShowMeaning(false);
    }, 8000);
    return () => clearInterval(autoRotateRef.current);
  }, []);

  const restartRotate = () => {
    clearInterval(autoRotateRef.current);
    autoRotateRef.current = setInterval(() => {
      setDailyIndex((i) => i + 1);
      setShowMeaning(false);
    }, 8000);
  };

  const handleRegister = async () => {
    if (!registrationForm.name || !registrationForm.email || !registrationForm.phone) {
      setSubmitResult({ success: false, error: 'Please fill in all required fields.' });
      return;
    }
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const payload = { ...registrationForm, language: selectedLanguage };

      // Browser → FormSubmit emails moktarul@gmail.com (avoids Render IP / Cloudflare blocks)
      const mailRes = await fetch('https://formsubmit.co/ajax/moktarul@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          language: payload.language,
          message: payload.message || '(none)',
          _subject: `Mok Kannada — New Live Session Registration: ${payload.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const mailData = await mailRes.json().catch(() => ({}));
      if (!mailRes.ok || mailData.success === 'false') {
        throw new Error(mailData.message || 'Could not send registration email. Please try again.');
      }

      // Best-effort server log / SMTP / PHP relay (does not block UX if it fails)
      try {
        const registerUrl = API_BASE.endsWith('/api')
          ? `${API_BASE}/register`
          : `${API_BASE}/register.php`;
        await fetch(registerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (_) {
        // ignore secondary failures
      }

      setSubmitResult({
        success: true,
        message: 'Registration successful! We will contact you shortly.',
      });
      setRegistrationForm({ name: '', email: '', phone: '', message: '' });
    } catch (e) {
      setSubmitResult({ success: false, error: e.message || 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const langCode =
    selectedLanguage === 'English' ? 'EN' : selectedLanguage === 'Hindi' ? 'HI' : 'BN';

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={require('../assets/images/header.jpg')}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(26,18,16,0.15)', 'rgba(26,18,16,0.55)', COLORS.cream]}
            locations={[0, 0.55, 1]}
            style={styles.heroGradient}
          />

          <View style={styles.topBar}>
            <TouchableOpacity style={styles.langPill} onPress={() => setShowLanguageMenu(true)}>
              <MaterialIcons name="language" size={15} color={COLORS.ink} />
              <Text style={styles.langPillText}>{langCode} → KN</Text>
              <MaterialIcons name="keyboard-arrow-down" size={15} color={COLORS.muted} />
            </TouchableOpacity>

            <View style={styles.topRight}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
              {isAuthenticated && user?.picture ? (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                  <Image source={{ uri: user.picture }} style={styles.avatar} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.settingsIconBtn}
                  onPress={() => navigation.navigate('Settings')}
                >
                  <MaterialIcons name="settings" size={20} color={COLORS.ink} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Animated.View
            style={[
              styles.heroCopy,
              { opacity: heroFade, transform: [{ translateY: heroRise }] },
            ]}
          >
            <Text style={styles.brandKannada}>ಕನ್ನಡ</Text>
            <Text style={styles.brandLatin}>Mok Kannada</Text>
            <Text style={styles.heroSupport}>
              {user?.name
                ? `Welcome back, ${user.name.split(' ')[0]}`
                : 'Learn to speak Kannada — start with the basics.'}
            </Text>
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => navigation.navigate('Basics', { language: selectedLanguage })}
              activeOpacity={0.88}
            >
              <Text style={styles.heroCtaText}>Start learning</Text>
              <MaterialIcons name="arrow-forward" size={18} color={COLORS.cream} />
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>

        <View style={styles.contentWrapper}>
          <Text style={styles.sectionLabel}>Learn</Text>
          <View style={styles.courseList}>
            {COURSE_CARDS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.courseRow}
                onPress={() => navigation.navigate(item.screen, { language: selectedLanguage })}
                activeOpacity={0.85}
              >
                <View style={[styles.courseIcon, { backgroundColor: item.iconBg }]}>
                  <MaterialIcons name={item.icon} size={22} color={COLORS.white} />
                </View>
                <View style={styles.courseText}>
                  <Text style={styles.courseTitle}>{item.title}</Text>
                  <Text style={styles.courseSubtitle}>{item.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailyCard}>
            <View style={styles.dailyHeader}>
              <View style={styles.dailyToggle}>
                <TouchableOpacity
                  style={[styles.dailyPill, !isDailySentence && styles.dailyPillActive]}
                  onPress={() => {
                    setIsDailySentence(false);
                    setShowMeaning(false);
                    restartRotate();
                  }}
                >
                  <Text style={[styles.dailyPillTxt, !isDailySentence && styles.dailyPillTxtActive]}>
                    Word
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dailyPill, isDailySentence && styles.dailyPillActive]}
                  onPress={() => {
                    setIsDailySentence(true);
                    setShowMeaning(false);
                    restartRotate();
                  }}
                >
                  <Text style={[styles.dailyPillTxt, isDailySentence && styles.dailyPillTxtActive]}>
                    Sentence
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.dailyReloadBtn}
                onPress={() => {
                  setDailyIndex((i) => i + 1);
                  setShowMeaning(false);
                }}
              >
                <MaterialIcons name="refresh" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.dailyBody}>
              {!isDailySentence && dailyItem.emoji ? (
                <Text style={styles.dailyEmoji}>{dailyItem.emoji}</Text>
              ) : null}
              <Text style={styles.dailyKannada}>{dailyItem.kannada}</Text>
              <Text style={styles.dailyPronun}>{dailyItem.pronunciation}</Text>
              {showMeaning ? (
                <Text style={styles.dailyMeaning}>{dailyItem.english}</Text>
              ) : (
                <TouchableOpacity style={styles.dailyRevealBtn} onPress={() => setShowMeaning(true)}>
                  <Text style={styles.dailyRevealTxt}>Reveal meaning</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isAuthenticated ? (
            <TouchableOpacity style={styles.logoutRow} onPress={logout}>
              <Feather name="log-out" size={16} color={COLORS.muted} />
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.liveBannerFixed}>
        <View style={styles.liveBannerContent}>
          <View style={styles.liveBannerLeft}>
            <View style={styles.liveBadgeSmall}>
              <View style={styles.liveDotSmall} />
              <Text style={styles.liveBadgeTextSmall}>LIVE</Text>
            </View>
            <Text style={styles.liveBannerTitleFixed}>1-1 Live Sessions</Text>
            <Text style={styles.liveMeta}>20m/day · 3d/week · 15 sessions</Text>
          </View>
          <View style={styles.liveBannerRight}>
            <TouchableOpacity
              style={styles.liveRegisterBtn}
              onPress={() => {
                setSubmitResult(null);
                setShowRegistrationModal(true);
              }}
            >
              <Text style={styles.liveRegisterBtnTxt}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.livePriceLarge}>₹3,000</Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
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
                <Text
                  style={[
                    styles.languageOptionText,
                    selectedLanguage === lang && styles.languageOptionTextSelected,
                  ]}
                >
                  {lang}
                </Text>
                {selectedLanguage === lang ? (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} />
                ) : null}
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

      <Modal
        animationType="slide"
        transparent={false}
        visible={showRegistrationModal}
        onRequestClose={() => setShowRegistrationModal(false)}
      >
        <View style={styles.fullPageModal}>
          <View style={styles.fullPageHeader}>
            <TouchableOpacity onPress={() => setShowRegistrationModal(false)} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.ink} />
            </TouchableOpacity>
            <Text style={styles.fullPageTitle}>Register for Live Session</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.fullPageContent} showsVerticalScrollIndicator={false}>
            <View style={styles.sessionInfoCard}>
              <FontAwesome5 name="chalkboard-teacher" size={36} color={COLORS.primary} />
              <Text style={styles.sessionInfoTitle}>1-1 Live Kannada Sessions</Text>
              <Text style={styles.sessionInfoText}>20 mins/day · 3 days/week · 15 sessions · ₹3,000</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Your Details</Text>
              {submitResult ? (
                <View
                  style={[
                    styles.alertBox,
                    submitResult.success ? styles.alertSuccess : styles.alertError,
                  ]}
                >
                  <Text
                    style={{ color: submitResult.success ? '#388E3C' : '#D32F2F', flex: 1 }}
                  >
                    {submitResult.success ? submitResult.message : submitResult.error}
                  </Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={registrationForm.name}
                  onChangeText={(text) => setRegistrationForm({ ...registrationForm, name: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={registrationForm.email}
                  onChangeText={(text) => setRegistrationForm({ ...registrationForm, email: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 XXXXX XXXXX"
                  keyboardType="phone-pad"
                  value={registrationForm.phone}
                  onChangeText={(text) => setRegistrationForm({ ...registrationForm, phone: text })}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.fullPageFooter}>
            <TouchableOpacity
              style={[styles.registerSubmitButtonFull, submitting && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.registerSubmitText}>Submit Registration</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                </>
              )}
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
    backgroundColor: COLORS.cream,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  hero: {
    width: '100%',
    minHeight: CONTENT_WIDTH * 1.05,
    justifyContent: 'space-between',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,248,243,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ink,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,248,243,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
  },
  streakFire: {
    fontSize: 12,
  },
  streakNum: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ink,
  },
  settingsIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,248,243,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: COLORS.cream,
  },
  heroCopy: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  brandKannada: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '700',
    color: COLORS.cream,
  },
  brandLatin: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B5A',
  },
  heroSupport: {
    marginTop: 10,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,248,243,0.9)',
    maxWidth: 280,
  },
  heroCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  heroCtaText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  contentWrapper: {
    paddingHorizontal: 16,
    marginTop: -8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 10,
  },
  courseList: {
    gap: 8,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(26,18,16,0.1)',
  },
  courseIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  courseText: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  courseSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
  },
  dailyCard: {
    marginTop: 24,
    backgroundColor: COLORS.sand,
    borderRadius: 18,
    padding: 16,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 3,
  },
  dailyPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dailyPillActive: {
    backgroundColor: COLORS.primary,
  },
  dailyPillTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  dailyPillTxtActive: {
    color: COLORS.cream,
  },
  dailyReloadBtn: {
    padding: 6,
  },
  dailyBody: {
    marginTop: 18,
    alignItems: 'center',
  },
  dailyEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  dailyKannada: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.ink,
  },
  dailyPronun: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
  },
  dailyMeaning: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dailyRevealBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dailyRevealTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  logoutRow: {
    marginTop: 28,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '600',
  },
  liveBannerFixed: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,18,16,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  liveBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  liveBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 4,
  },
  liveDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.white,
  },
  liveBadgeTextSmall: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  liveBannerTitleFixed: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink,
  },
  liveMeta: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.muted,
  },
  liveBannerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  liveRegisterBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  liveRegisterBtnTxt: {
    color: COLORS.cream,
    fontWeight: '700',
    fontSize: 13,
  },
  livePriceLarge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 12,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(26,18,16,0.1)',
  },
  languageOptionSelected: {
    backgroundColor: 'transparent',
  },
  languageOptionText: {
    fontSize: 16,
    color: COLORS.ink,
  },
  languageOptionTextSelected: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalCloseButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.muted,
  },
  fullPageModal: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  fullPageHeader: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  fullPageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink,
  },
  fullPageContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sessionInfoCard: {
    backgroundColor: COLORS.sand,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  sessionInfoTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    textAlign: 'center',
  },
  sessionInfoText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
  formSection: {
    paddingBottom: 40,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 12,
  },
  alertBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
  },
  alertError: {
    backgroundColor: '#FFEBEE',
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(26,18,16,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.ink,
  },
  fullPageFooter: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(26,18,16,0.1)',
  },
  registerSubmitButtonFull: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerSubmitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;
