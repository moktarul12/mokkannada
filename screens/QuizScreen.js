import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CommonHeader from '../components/CommonHeader';

const { width } = Dimensions.get('window');

const QuizScreen = ({ route }) => {
  const { lesson } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showKannada, setShowKannada] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    generateQuestions();
  }, [lesson]);

  const generateQuestions = () => {
    try {
      let generatedQuestions = [];
      
      // Add vocabulary questions
      if (lesson.vocabulary) {
        const vocab = Array.isArray(lesson.vocabulary) 
          ? lesson.vocabulary 
          : Object.entries(lesson.vocabulary).map(([kannada, english]) => ({
              kannada,
              english: typeof english === 'string' ? english : english.translation || '',
              pronunciation: english.pronunciation || '',
              type: 'vocabulary'
            }));
        
        generatedQuestions = [...generatedQuestions, ...vocab];
      }

      // Add conversation lines
      if (lesson.conversations) {
        lesson.conversations.forEach(conv => {
          const lines = conv.lines || [];
          lines.forEach(line => {
            if (typeof line === 'object' && (line.kannada || line.english)) {
              generatedQuestions.push({
                type: 'conversation',
                kannada: line.kannada || '',
                english: line.english || '',
                pronunciation: line.pronunciation || '',
                context: line.context
              });
            }
          });
        });
      }

      // Add phrases if available
      if (lesson.phrases) {
        lesson.phrases.forEach(phrase => {
          generatedQuestions.push({
            type: 'phrase',
            kannada: phrase.kannada,
            english: phrase.english,
            pronunciation: phrase.pronunciation || '',
            usage: phrase.usage
          });
        });
      }

      // Shuffle and set questions
      setQuestions(generatedQuestions.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed generateOptions as we're not using multiple choice anymore

  const speakText = async (text) => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    
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
      await Speech.speak(text, { 
        language: 'kn-IN',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (error) {
      console.log('Error speaking:', error);
      setIsSpeaking(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowAnswer(false);
    generateQuestions();
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentQuestion(prev => 
      prev < questions.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentQuestion(prev => 
      prev > 0 ? prev - 1 : questions.length - 1
    );
  };

  if (loading || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  const currentQ = questions[currentQuestion];
  const hasPronunciation = !!currentQ.pronunciation;

  return (
    <View style={styles.container}>
      <CommonHeader title={`Lesson ${lesson.lesson || 1}`} />

      <View style={styles.subHeader}>
        <View style={styles.languageToggleContainer}>
          <TouchableOpacity 
            style={[styles.languageToggleButton, showKannada && styles.languageToggleActive]}
            onPress={() => setShowKannada(!showKannada)}
          >
            <Text style={styles.languageToggleText}>ಕ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.languageToggleButton, showEnglish && styles.languageToggleActive]}
            onPress={() => setShowEnglish(!showEnglish)}
          >
            <Text style={styles.languageToggleText}>En</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
        <Text style={styles.progressText}>
          {currentQuestion + 1} / {questions.length}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {currentQ.type === 'vocabulary' ? 'Vocabulary' : 
               currentQ.type === 'conversation' ? 'Conversation' : 'Phrase'}
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            {showKannada && currentQ.kannada && (
              <View style={styles.textRow}>
                <Text style={styles.kannadaText}>{currentQ.kannada}</Text>
                <TouchableOpacity 
                  style={[styles.speakerButton, isSpeaking && styles.speakerButtonActive]}
                  onPress={() => speakText(currentQ.kannada)}
                >
                  <Ionicons 
                    name={isSpeaking ? 'volume-high' : 'volume-high-outline'} 
                    size={24} 
                    color={isSpeaking ? 'white' : '#666'} 
                  />
                </TouchableOpacity>
              </View>
            )}
            
            {showEnglish && currentQ.english && (
              <View style={styles.textRow}>
                <Text style={styles.englishText}>{currentQ.english}</Text>
              </View>
            )}
            
            {currentQ.pronunciation && (
              <Text style={styles.pronunciationText}>
                {currentQ.pronunciation}
              </Text>
            )}
            
            {currentQ.usage && (
              <View style={styles.usageContainer}>
                <Text style={styles.usageLabel}>Usage:</Text>
                <Text style={styles.usageText}>{currentQ.usage}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.cardFooter}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handlePrevious}
            >
              <Ionicons name="arrow-back" size={20} color="#FF3333" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navButton, {flexDirection: 'row-reverse'}]}
              onPress={handleNext}
            >
              <Ionicons name="arrow-forward" size={20} color="#FF3333" />
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          {currentQ.context && currentQ.context.length > 0 && (
            <View style={styles.contextContainer}>
              <Text style={styles.contextTitle}>Context:</Text>
              {currentQ.context.map((line, i) => (
                <View key={i} style={styles.contextLine}>
                  {line.kannada && <Text style={styles.kannadaText}>{line.kannada}</Text>}
                  {line.english && <Text style={styles.englishText}>{line.english}</Text>}
                </View>
              ))}
            </View>
          )}

          {currentQ.options && (
            <View style={styles.optionsContainer}>
              {currentQ.options.map((option, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      showResult && (option === currentQ.answer ? styles.correctOption : styles.incorrectOption),
                    ]}
                    onPress={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                  >
                    <Text style={[
                      styles.optionText,
                      showResult && (option === currentQ.answer ? styles.correctOptionText : styles.incorrectOptionText),
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContent: {
    padding: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  kannadaText: {
    fontSize: 28,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  englishText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  pronunciationText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
  },
  usageContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  usageLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  usageText: {
    color: '#666',
    lineHeight: 22,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navButtonText: {
    color: '#FF3333',
    marginHorizontal: 5,
    fontWeight: '500',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
  },
  languageToggle: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  languageText: {
    color: '#FF3333',
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3333',
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  quizContainer: {
    flex: 1,
    padding: 15,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionType: {
    color: '#FF3333',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  scoreContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionContent: {
    marginBottom: 10,
  },
  promptText: {
    color: '#666',
    marginBottom: 15,
    fontSize: 16,
  },
  questionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  speakerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  speakerButtonActive: {
    backgroundColor: '#FF3333',
  },
  contextContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  contextTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  contextLine: {
    marginBottom: 6,
  },
  kannadaText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  englishText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectOption: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    opacity: 0.7,
  },
  correctOptionText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: '#c62828',
    textDecorationLine: 'line-through',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
});

export default QuizScreen;