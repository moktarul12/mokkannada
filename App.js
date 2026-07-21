import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

import MobileShell from './components/MobileShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import LessonList from './components/LessonList';
import BasicsScreen from './screens/BasicsScreen';
import ConversationDetail from './screens/ConversationDetail';
import ConversationList from './screens/ConversationList';
import ConversationPractice from './screens/ConversationPractice';
import GrammarScreen from './screens/GrammarScreen';
import HomeScreen from './screens/HomeScreen';
import LessonDetail from './screens/LessonDetail';
import LoginScreen from './screens/LoginScreen';
import NumbersScreen from './screens/NumbersScreen';
import QuizScreen from './screens/QuizScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutUsScreen from './screens/AboutUsScreen';

const Stack = createNativeStackNavigator();

const commonScreenOptions = {
  headerStyle: {
    backgroundColor: '#E8392B',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitle: 'Back',
};

const AppNavigator = () => {
  const { isLoading, isAuthenticated, isAuth0Configured } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#E8392B" />
      </View>
    );
  }

  // When Auth0 is configured, require login before the learning home.
  // Without credentials, keep the app usable for local UI work.
  const showApp = isAuthenticated || !isAuth0Configured;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!showApp ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Basics"
              component={BasicsScreen}
              options={{ title: 'Kannada Basics', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="Numbers"
              component={NumbersScreen}
              options={{ title: 'Kannada Numbers', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="Grammar"
              component={GrammarScreen}
              options={{ title: 'Kannada Grammar', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="LessonList"
              component={LessonList}
              options={{ title: 'Kannada Lessons', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="LessonDetail"
              component={LessonDetail}
              options={{ ...commonScreenOptions, headerBackTitle: 'Lessons' }}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ title: 'Quiz', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="ConversationList"
              component={ConversationList}
              options={{ title: 'Conversations', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="ConversationDetail"
              component={ConversationDetail}
              options={{ title: 'Conversation', ...commonScreenOptions, headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="ConversationPractice"
              component={ConversationPractice}
              options={{
                title: 'Practice Conversation',
                ...commonScreenOptions,
                headerShown: true,
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings', ...commonScreenOptions }}
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUsScreen}
              options={{ title: 'About Us', ...commonScreenOptions }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MobileShell>
        <StatusBar barStyle="light-content" backgroundColor="#E8392B" />
        <AppNavigator />
      </MobileShell>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F3',
  },
});

export default App;
