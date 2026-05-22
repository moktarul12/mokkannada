import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import CommonHeader from '../components/CommonHeader';

const SettingsScreen = ({ navigation }) => {
  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for your support!');
  };

  const handleShareApp = () => {
    Alert.alert('Share App', 'Share with friends and family!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Opening privacy policy...');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Opening terms of service...');
  };

  const handleContactUs = () => {
    Linking.openURL('mailto:support@kannadaspeakingapp.com');
  };

  const settingsOptions = [
    {
      id: 'rate',
      title: 'Rate App',
      subtitle: 'Share your feedback',
      icon: 'star',
      iconBg: '#FFB800',
      onPress: handleRateApp,
    },
    {
      id: 'share',
      title: 'Share App',
      subtitle: 'Tell your friends',
      icon: 'share',
      iconBg: '#4CAF50',
      onPress: handleShareApp,
    },
    {
      id: 'about',
      title: 'About Us',
      subtitle: 'Learn more about the app',
      icon: 'info',
      iconBg: '#2196F3',
      onPress: () => navigation.navigate('AboutUs'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      icon: 'shield',
      iconBg: '#9C27B0',
      onPress: handlePrivacyPolicy,
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'App usage terms',
      icon: 'description',
      iconBg: '#FF5722',
      onPress: handleTermsOfService,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      subtitle: 'Get in touch',
      icon: 'mail',
      iconBg: '#00BCD4',
      onPress: handleContactUs,
    },
  ];

  return (
    <View style={styles.container}>
      <CommonHeader title="Settings" showBack={true} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.appInfo}>
            <MaterialIcons name="settings" size={60} color="#FF3333" />
            <Text style={styles.appName}>Kannada Speaking App</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>

          <View style={styles.optionsList}>
            {settingsOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.iconBg }]}>
                  <MaterialIcons name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ for Kannada learners</Text>
            <Text style={styles.footerCopyright}>© 2024 Dromominds</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  appInfo: {
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
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;
