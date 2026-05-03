import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  primary: '#FF3333',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  background: '#F8F9FA',
};

const CommonHeader = ({ title, showBack = true, showSettings = true, onSettingsPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
            <Text style={styles.backText}>Back</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {showSettings ? (
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={onSettingsPress || (() => alert('Settings - Change Language'))}
            activeOpacity={0.7}
          >
            <View style={styles.settingsButtonInner}>
              <Feather name="more-vertical" size={20} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonInner: {
    padding: 5,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
});

export default CommonHeader;
