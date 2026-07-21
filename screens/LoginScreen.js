import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login, isLoading, error, isAuth0Configured, redirectUri, loginReady } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;
  const busy = isLoading || (isAuth0Configured && !loginReady);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../assets/images/header.jpg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26,18,16,0.25)', 'rgba(26,18,16,0.72)', '#1A1210']}
          style={styles.overlay}
        />
      </ImageBackground>

      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <Text style={styles.brandKannada}>ಕನ್ನಡ</Text>
        <Text style={styles.brandLatin}>Mok Kannada</Text>
        <Text style={styles.tagline}>Speak Kannada with confidence — one phrase at a time.</Text>

        <TouchableOpacity
          style={[styles.cta, (!isAuth0Configured || busy) && styles.ctaDisabled]}
          onPress={login}
          disabled={!isAuth0Configured || busy}
          activeOpacity={0.85}
        >
          {busy ? (
            <ActivityIndicator color="#1A1210" />
          ) : (
            <>
              <FontAwesome5 name="google" size={18} color="#4285F4" />
              <Text style={styles.ctaText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!isAuth0Configured ? (
          <Text style={styles.hint}>
            Add AUTH0_DOMAIN and AUTH0_CLIENT_ID to .env, then allow callback{'\n'}
            {redirectUri}
          </Text>
        ) : (
          <Text style={styles.hint}>Same-tab Google sign-in · no popup</Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1210',
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 56,
  },
  brandKannada: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '700',
    color: '#FFF8F3',
    letterSpacing: 1,
  },
  brandLatin: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#FF5A45',
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 14,
    marginBottom: 28,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,248,243,0.85)',
    maxWidth: 300,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaDisabled: {
    opacity: 0.65,
  },
  ctaText: {
    color: '#1A1210',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    marginTop: 14,
    color: '#FFB4A8',
    fontSize: 13,
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    color: 'rgba(255,248,243,0.55)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default LoginScreen;
