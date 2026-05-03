import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CommonHeader from '../components/CommonHeader';
import ConversationBubble from '../components/ConversationBubble';

const ConversationDetail = ({ route, navigation }) => {
  const { conversation, userName, friendName } = route.params;
  const [messages, setMessages] = useState(conversation.lines || []);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showKannada, setShowKannada] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const scrollViewRef = useRef();


  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    // In a real app, you would add the new message to the conversation
    // For now, we'll just clear the input
    setNewMessage('');
  };

  // Simple response logic - in a real app, this would be more sophisticated
  const getResponseMessage = (message) => {
    const responses = {
      'hello': 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಿ?',
      'hi': 'ಹಾಯ್! ಹೇಗಿದ್ದೀರಿ?',
      'how are you': 'ನನಗೆ ಚೆನ್ನಾಗಿದೆ, ಧನ್ಯವಾದಗಳು! ನೀವು ಹೇಗಿದ್ದೀರಿ?',
      'what is your name': `ನನ್ನ ಹೆಸರು ${friendName}. ನಿಮ್ಮ ಹೆಸರೇನು?`,
      'thank you': 'ಸ್ವಾಗತ!',
      'goodbye': 'ಬೈ! ನಂತರ ಭೇಟಿಯಾಗೋಣ!',
      'default': 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಹೇಳಿ.'
    };

    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }
    return responses['default'];
  };

  const getEnglishTranslation = (message) => {
    const translations = {
      'ನಮಸ್ಕಾರ': 'Hello',
      'ಹೇಗಿದ್ದೀರಿ': 'How are you?',
      'ನನಗೆ ಚೆನ್ನಾಗಿದೆ': 'I am fine',
      'ಧನ್ಯವಾದಗಳು': 'Thank you',
      'ಸ್ವಾಗತ': 'You\'re welcome',
      'ಬೈ': 'Goodbye',
      'ನಂತರ ಭೇಟಿಯಾಗೋಣ': 'See you later',
      'ನನ್ನ ಹೆಸರು': 'My name is',
      'ನಿಮ್ಮ ಹೆಸರೇನು': 'What is your name?',
    };

    return translations[message] || message;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage1 = (message, index) => {
    const isRightAligned = index % 2 === 1;
    const showName = !isRightAligned && (index === 0 || index % 2 === 0);
    
    // Skip rendering if both languages are hidden
    if ((!showEnglish && !showKannada) || 
        (!showEnglish && !message.text) || 
        (!showKannada && !message.english)) {
      return null;
    }
    
    return (
      <ConversationBubble
        key={message.id}
        message={message}
        isRightAligned={isRightAligned}
        showName={showName}
        showEnglish={showEnglish}
        showKannada={showKannada}
        senderName={isRightAligned ? userName : friendName}
      />
    );
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  const toggleLanguage = (language) => {
    if (language === 'english') {
      setShowEnglish(!showEnglish);
    } else if (language === 'kannada') {
      setShowKannada(!showKannada);
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
          color={showEnglish ? '#4CAF50' : '#666'} 
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
          color={showKannada ? '#4CAF50' : '#666'} 
        />
        <Text style={styles.languageOptionText}>ಕನ್ನಡ</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMessage = (line, index) => {
    const [speaker] = Object.keys(line);
    const text = line[speaker];
    const translation = line.translation;
    const isRightAligned = speaker === 'A'; // Assuming 'A' is the user and 'B' is the friend
    
    // Skip rendering if both languages are hidden
    if ((!showEnglish && !showKannada) || 
        (!showEnglish && !text) || 
        (!showKannada && !translation)) {
      return null;
    }
    
    return (
      <View 
        key={index} 
        style={[
          styles.messageContainer, 
          isRightAligned ? styles.rightMessageContainer : styles.leftMessageContainer
        ]}
      >
        <View 
          style={[
            styles.messageBubble,
            isRightAligned ? styles.rightMessageBubble : styles.leftMessageBubble
          ]}
        >
          {showEnglish && text && (
            <Text style={isRightAligned ? styles.rightMessageText : styles.leftMessageText}>
              {text}
            </Text>
          )}
          {showKannada && translation && (
            <Text style={styles.englishTranslation}>
              {translation}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader title={conversation.title || 'Conversation'} />
      {/* Language Toggle Button */}

      <View style={styles.languageButtonContainer}>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={toggleLanguageMenu}
        >
          <MaterialCommunityIcons name="translate" size={24} color="#fff" />
        </TouchableOpacity>
        {showLanguageMenu && renderLanguageMenu()}
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardDismissMode="interactive"
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={[styles.messageContainer, styles.rightMessageContainer, { marginTop: 8 }]}>
            <View style={[styles.messageBubble, styles.rightMessageBubble]}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={90}
      >
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={newMessage.trim() === ''}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={newMessage.trim() === '' ? '#ccc' : '#FF3333'} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  languageButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 100,
    elevation: 5,
  },
  languageButton: {
    backgroundColor: '#4CAF50',
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
    bottom: 60,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
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
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 8,
    maxWidth: '85%',
  },
  rightMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  leftMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rightMessageBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  leftMessageBubble: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  rightMessageText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'KannadaSangamMN-Bold',
    textAlign: 'right',
  },
  leftMessageText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'KannadaSangamMN-Bold',
    textAlign: 'left',
  },
  englishTranslation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 4,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});

export default ConversationDetail;
