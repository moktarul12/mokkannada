import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ConversationList = ({ navigation }) => {

  const [conversations, setConversations] = useState([]);
  const [userName, setUserName] = useState('You');
  const [friendName, setFriendName] = useState('Friend');
  const [isEditing, setIsEditing] = useState(false);

  // Sample conversation data
  useEffect(() => {
    const sampleConversations = [
      {
        id: '1',
        title: 'Greetings',
        preview: 'Hello! How are you?',
        lines: [
          { A: 'Hello! How are you?', translation: 'ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?' },
          { B: 'ನನಗೆ ಚೆನ್ನಾಗಿದೆ, ಧನ್ಯವಾದಗಳು!', translation: 'I am fine, thank you!' },
          { A: 'What is your name?', translation: 'ನಿಮ್ಮ ಹೆಸರೇನು?' },
          { B: 'ನನ್ನ ಹೆಸರು ರಾಜ್', translation: 'My name is Raj' },
        ]
      },
      {
        id: '2',
        title: 'At the Restaurant',
        preview: 'Ordering food...',
        lines: [
          { A: 'I would like to order', translation: 'ನಾನು ಆರ್ಡರ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ' },
          { B: 'What would you like to have?', translation: 'ನೀವು ಏನು ತೆಗೆದುಕೊಳ್ಳುತ್ತೀರಿ?' },
          { A: 'Idli and Dosa, please', translation: 'ಇಡ್ಲಿ ಮತ್ತು ದೋಸೆ, ದಯವಿಟ್ಟು' },
          { B: 'Anything else?', translation: 'ಬೇರೆ ಏನಾದರೂ ಬೇಕೇ?' },
        ]
      },
      {
        id: '3',
        title: 'Shopping',
        preview: 'How much does this cost?',
        lines: [
          { A: 'How much does this cost?', translation: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?' },
          { B: 'It is 500 rupees', translation: 'ಇದು ೫೦೦ ರೂಪಾಯಿ' },
          { A: 'That\'s too expensive', translation: 'ಅದು ತುಂಬಾ ದುಬಾರಿಯಾಗಿದೆ' },
          { B: 'I can give you for 400', translation: 'ನಾನು ನಿಮಗೆ ೪೦೦ ಕ್ಕೆ ಕೊಡುತ್ತೇನೆ' },
        ]
      },
      {
        id: '4',
        title: 'Directions',
        preview: 'How do I get to...',
        lines: [
          { A: 'How do I get to MG Road?', translation: 'ನಾನು ಎಂಜಿ ರಸ್ತೆಗೆ ಹೇಗೆ ಹೋಗಬಹುದು?' },
          { B: 'Go straight and take the second left', translation: 'ನೇರವಾಗಿ ಹೋಗಿ ಎಡಕ್ಕೆ ಎರಡನೇ ತಿರುವು ತೆಗೆದುಕೊಳ್ಳಿ' },
          { A: 'Is it far from here?', translation: 'ಇದು ಇಲ್ಲಿಂದ ದೂರವೇ?' },
          { B: 'No, it\'s just 5 minutes walk', translation: 'ಇಲ್ಲ, ಇದು ಕೇವಲ 5 ನಿಮಿಷಗಳ ನಡಿಗೆ ದೂರದಲ್ಲಿದೆ' },
        ]
      },
      {
        id: '5',
        title: 'At the Hotel',
        preview: 'I would like to check in...',
        lines: [
          { A: 'I would like to check in', translation: 'ನಾನು ಚೆಕ್ ಇನ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ' },
          { B: 'Do you have a reservation?', translation: 'ನಿಮಗೆ ಮುಂಗಡ ಪುಸ್ತಕವಿದೆಯೇ?' },
          { A: 'Yes, under the name Smith', translation: 'ಹೌದು, ಸ್ಮಿತ್ ಎಂಬ ಹೆಸರಿನಲ್ಲಿ' },
          { B: 'Here is your room key', translation: 'ಇದು ನಿಮ್ಮ ಕೋಣೆಯ ಕೀಲಿ' },
        ]
      },
    ];
    setConversations(sampleConversations);
  }, []);

  const handleNameSave = () => {
    // Save names to state or async storage
    setIsEditing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ConversationDetail', { 
        conversation: item,
        userName,
        friendName
      })}
    >
      <View style={styles.conversationIcon}>
        <MaterialIcons name="chat-bubble" size={24} color="#FF3333" />
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle}>{item.title}</Text>
        <Text style={styles.conversationPreview} numberOfLines={1}>{item.preview}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title="Conversations" />
      <View style={styles.subHeader}>
        <View>
          <Text style={styles.headerTitle}>Practice Conversations</Text>
          <Text style={styles.headerSubtitle}>Select a conversation to start practicing</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <MaterialIcons name="edit" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.nameInputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Your Name:</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter your name"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Friend's Name:</Text>
            <TextInput
              style={styles.input}
              value={friendName}
              onChangeText={setFriendName}
              placeholder="Enter friend's name"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleNameSave}>
            <Text style={styles.saveButtonText}>Save Names</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
    marginRight: -8,
  },
  listContent: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationIcon: {
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
    marginRight: 12,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#666',
  },
  nameInputContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF3333',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConversationList;
