import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ConversationBubble from '../components/ConversationBubble';

const LessonDetail = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [activeTab, setActiveTab] = useState('conversations');
  const [showEnglish, setShowEnglish] = useState(true);
  const [showKannada, setShowKannada] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const renderConversationList = () => {
    if (!lesson.conversations || lesson.conversations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No conversations available</Text>
        </View>
      );
    }

    return (
      <View style={styles.conversationList}>
        {lesson.conversations.map((conversation, index) => (
          <TouchableOpacity
            key={conversation.id || index}
            style={styles.conversationItem}
            onPress={() => setSelectedConversation(conversation)}
          >
            <Text style={styles.conversationItemTitle}>
              {conversation.title || `Conversation ${index + 1}`}
            </Text>
            <Text style={styles.conversationItemPreview} numberOfLines={1}>
              {conversation.lines?.[0]?.A || conversation.lines?.[0]?.B || 'Start conversation...'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderConversationDetail = (conversation) => {
    const lines = conversation.lines || conversation.turns || [];
    
    return (
      <View style={styles.conversationDetailContainer}>
        <View style={styles.conversationHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backToListButton}
              onPress={() => setSelectedConversation(null)}
            >
              <MaterialIcons name="arrow-back" size={20} color="#FF3333" />
              <Text style={styles.backToListText}>Back to list</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.languageToggleContainer}>
            <TouchableOpacity 
              style={[
                styles.languageToggleButton, 
                showEnglish && styles.languageToggleButtonActive
              ]}
              onPress={() => toggleLanguage('english')}
            >
              <Text style={[
                styles.languageToggleText,
                showEnglish && styles.languageToggleTextActive
              ]}>
                EN
              </Text>
            </TouchableOpacity>
            <View style={styles.languageToggleDivider} />
            <TouchableOpacity 
              style={[
                styles.languageToggleButton, 
                showKannada && styles.languageToggleButtonActive
              ]}
              onPress={() => toggleLanguage('kannada')}
            >
              <Text style={[
                styles.languageToggleText,
                showKannada && styles.languageToggleTextActive,
                { fontFamily: 'KannadaSangamMN' }
              ]}>
                ಕನ್ನಡ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.conversationContainer}>
          <Text style={styles.conversationTitle}>
            {conversation.title || 'Conversation'}
          </Text>
          
          <View style={styles.chatContainer}>
            {lines.map((line, index) => {
              const speaker = line.speaker || (typeof line === 'object' ? Object.keys(line)[0] : '');
              const isRightAligned = index % 2 === 1;
              const showName = !isRightAligned && (index === 0 || 
                (lines[index-1]?.speaker || (typeof lines[index-1] === 'object' ? Object.keys(lines[index-1] || {})[0] : '')) !== speaker);
              
              const messageText = line.kannada || (typeof line === 'object' ? line[speaker] : line);
              const englishText = line.english || line.translation || '';
              
              if ((!showEnglish && !englishText) || (!showKannada && !messageText)) {
                return null;
              }
              
              return (
                <View key={index} style={styles.messageWrapper}>
                  <ConversationBubble
                    message={{
                      ...line,
                      text: messageText,
                      english: englishText
                    }}
                    isRightAligned={isRightAligned}
                    showName={showName}
                    showEnglish={showEnglish}
                    showKannada={showKannada}
                    senderName={speaker.replace(':', '')}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderVocabulary = () => {
    if (!lesson.vocabulary) return null;
    
    const vocabList = Array.isArray(lesson.vocabulary)
      ? lesson.vocabulary
      : Object.entries(lesson.vocabulary).map(([kannada, english]) => ({ kannada, english }));
    
    return (
      <View style={styles.vocabContainer}>
        <Text style={styles.sectionTitle}>Vocabulary</Text>
        <View style={styles.vocabList}>
          {vocabList.map((item, index) => (
            <View key={index} style={styles.vocabItem}>
              <Text style={styles.kannadaText}>{item.kannada}</Text>
              <Text style={styles.englishText}>{item.english}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderExercises = () => {
    if (!lesson.exercises) return null;
    
    return (
      <View style={styles.exercisesContainer}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {Array.isArray(lesson.exercises) ? (
          lesson.exercises.map((exercise, index) => (
            <View key={index} style={styles.exercise}>
              <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
              <Text style={styles.exerciseInstruction}>{exercise.instruction}</Text>
              {exercise.items && (
                <View style={styles.exerciseItems}>
                  {exercise.items.map((item, i) => (
                    <View key={i} style={styles.exerciseItem}>
                      <Text style={styles.exerciseQuestion}>
                        {item.q || item.input || item.question}
                      </Text>
                      <Text style={styles.exerciseAnswer}>
                        {item.answer || item.output_model || item.modelAnswer}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          Object.entries(lesson.exercises).map(([key, exercise]) => (
            <View key={key} style={styles.exercise}>
              <Text style={styles.exerciseTitle}>Exercise {key}</Text>
              <Text style={styles.exerciseInstruction}>{exercise.instruction}</Text>
              {exercise.items && (
                <View style={styles.exerciseItems}>
                  {Object.entries(exercise.items).map(([subKey, item], i) => (
                    <View key={i} style={styles.exerciseItem}>
                      {Array.isArray(item) ? (
                        <View>
                          <Text style={styles.exerciseQuestion}>{subKey}:</Text>
                          {item.map((subItem, j) => (
                            <Text key={j} style={styles.exerciseAnswer}>• {subItem.q || subItem}</Text>
                          ))}
                        </View>
                      ) : typeof item === 'object' ? (
                        <View>
                          <Text style={styles.exerciseQuestion}>{item.q || item.input || ''}</Text>
                          <Text style={styles.exerciseAnswer}>{item.answer || item.output_model || ''}</Text>
                        </View>
                      ) : (
                        <Text style={styles.exerciseAnswer}>{item}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </View>
    );
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };


  const toggleLanguage = (language) => {
    if (language === 'english') {
      debugger
      if (showEnglish && !showKannada) {
        debugger
        setShowEnglish(false);
        // If trying to deselect the only active language (English), enable Kannada instead
        setShowKannada(true);
      } else {
        // Toggle normally
        setShowEnglish(!showEnglish);
      }
    } else if (language === 'kannada') {
      if (showKannada && !showEnglish) {
        // If trying to deselect the only active language (Kannada), enable English instead
        setShowEnglish(true);
        setShowKannada(false);
      } else {
        // Toggle normally
        setShowKannada(!showKannada);
      }
    }
  };

  const renderLanguageMenu = () => (
    <View style={styles.languageMenu}>
      <TouchableOpacity 
        style={[styles.languageOption, !showEnglish && styles.languageOptionInactive]}
        onPress={() => toggleLanguage('english')}
      >
        <MaterialIcons 
          name={showEnglish ? 'check-box' : 'check-box-outline-blank'} 
          size={20} 
          color={showEnglish ? '#FF3333' : '#666'} 
        />
        <Text style={styles.languageOptionText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.languageOption, !showKannada && styles.languageOptionInactive]}
        onPress={() => toggleLanguage('kannada')}
      >
        <MaterialIcons 
          name={showKannada ? 'check-box' : 'check-box-outline-blank'} 
          size={20} 
          color={showKannada ? '#FF3333' : '#666'} 
        />
        <Text style={styles.languageOptionText}>ಕನ್ನಡ</Text>
      </TouchableOpacity>
    </View>
  );

  // Language Toggle Component
  const LanguageToggle = () => (
    <View style={styles.languageButtonContainer}>
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={toggleLanguageMenu}
      >
        <MaterialCommunityIcons name="translate" size={24} color="#fff" />
      </TouchableOpacity>
      {showLanguageMenu && (
        <>
          <TouchableOpacity 
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleLanguageMenu}
          />
          {renderLanguageMenu()}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title={lesson.title || `Lesson ${lesson.lesson}`} />

      {/* Language Toggle Button */}
      {activeTab === 'conversations' && !selectedConversation && <LanguageToggle />}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'conversations' && styles.activeTab]}
          onPress={() => setActiveTab('conversations')}
        >
          <MaterialIcons 
            name="chat" 
            size={20} 
            color={activeTab === 'conversations' ? '#FF3333' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'conversations' && styles.activeTabText]}>
            Conversations
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vocabulary' && styles.activeTab]}
          onPress={() => setActiveTab('vocabulary')}
        >
          <MaterialIcons 
            name="menu-book" 
            size={20} 
            color={activeTab === 'vocabulary' ? '#FF3333' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'vocabulary' && styles.activeTabText]}>
            Vocabulary
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'conversations' ? (
          selectedConversation 
            ? renderConversationDetail(selectedConversation)
            : renderConversationList()
        ) : (
          renderVocabulary()
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.quizButton}
        onPress={() => navigation.navigate('Quiz', { lesson })}
      >
        <MaterialIcons name="help-outline" size={24} color="white" />
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Conversation List Styles
  conversationList: {
    padding: 16,
  },
  conversationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  conversationItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  conversationItemPreview: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  languageToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  languageToggleButtonActive: {
    backgroundColor: '#FF3333',
  },
  languageToggleText: {
    fontSize: 14,
    color: '#666',
  },
  languageToggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  languageToggleDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 20,
  },
  backToListText: {
    marginLeft: 6,
    color: '#FF3333',
    fontSize: 15,
    fontWeight: '500',
  },
  conversationDetailContainer: {
    flex: 1,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  languageButtonContainer: {
    position: 'relative',
  },
  conversationLanguageButton: {
    position: 'relative',
    zIndex: 10,
    elevation: 5,
  },
  languageButton: {
    backgroundColor: '#FF3333',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  languageMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
    elevation: 5,
    minWidth: 150,
    zIndex: 101,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  languageOptionInactive: {
    opacity: 0.6,
  },
  languageOptionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF3333',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#FF3333',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  conversationsContainer: {
    marginBottom: 20,
  },
  conversationContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  kannadaText: {
    fontSize: 16,
    fontFamily: 'KannadaSangamMN-Bold',
    color: '#333',
    lineHeight: 24,
  },
  englishText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  vocabContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  vocabList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  vocabItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  exercise: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exerciseInstruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  exerciseItems: {
    marginTop: 8,
  },
  exerciseItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  exerciseQuestion: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  exerciseAnswer: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3333',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default LessonDetail;
