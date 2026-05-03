import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonHeader from '../components/CommonHeader';

const GrammarScreen = () => {
  return (
    <View style={styles.container}>
      <CommonHeader title="Grammar" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageSubtitle}>Start with the basics and build your Kannada grammar skills</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basics of sentence structure</Text>
          <Text style={styles.cardText}>Subject • Object • Verb (SOV) order in Kannada</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nouns and Pronouns</Text>
          <Text style={styles.cardText}>Understanding gender, number, and case markers</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verbs and Tenses</Text>
          <Text style={styles.cardText}>Present, Past, and Future tense conjugations</Text>
        </View>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>Start Learning</Text>
          <MaterialIcons name="play-arrow" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    lineHeight: 20,
  },
  startBtn: {
    backgroundColor: '#FF3333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  startBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default GrammarScreen;
