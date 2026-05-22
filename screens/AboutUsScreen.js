import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <CommonHeader title="About Us" showBack={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Image 
              source={require('../assets/images/favicon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Kannada Speaking App</Text>
            <Text style={styles.tagline}>Learn Kannada with Confidence</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={24} color="#FF3333" />
              <Text style={styles.sectionTitle}>Our Mission</Text>
            </View>
            <Text style={styles.sectionText}>
              We are dedicated to making Kannada language learning accessible, engaging, and effective for everyone. 
              Our app combines modern technology with proven teaching methods to help you master Kannada.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="emoji-objects" size={24} color="#FF3333" />
              <Text style={styles.sectionTitle}>What We Offer</Text>
            </View>
            <View style={styles.featuresList}>
              <FeatureItem icon="check-circle" text="Interactive lessons and exercises" />
              <FeatureItem icon="check-circle" text="Real-world conversations" />
              <FeatureItem icon="check-circle" text="AI-powered practice sessions" />
              <FeatureItem icon="check-circle" text="Live 1-1 tutoring sessions" />
              <FeatureItem icon="check-circle" text="Multi-language support" />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="people" size={24} color="#FF3333" />
              <Text style={styles.sectionTitle}>Our Team</Text>
            </View>
            <Text style={styles.sectionText}>
              Built by language enthusiasts and technology experts who are passionate about 
              preserving and promoting the beautiful Kannada language.
            </Text>
          </View>

          <View style={styles.statsSection}>
            <StatCard number="10K+" label="Active Users" icon="people" />
            <StatCard number="500+" label="Lessons" icon="school" />
            <StatCard number="4.8★" label="Rating" icon="star" />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Developed by Dromominds</Text>
            <Text style={styles.footerSubtext}>Making language learning fun and accessible</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={20} color="#4CAF50" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const StatCard = ({ number, label, icon }) => (
  <View style={styles.statCard}>
    <MaterialIcons name={icon} size={32} color="#FF3333" />
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default AboutUsScreen;
