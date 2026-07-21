import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH0_AUDIENCE as ENV_AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID as ENV_AUTH0_CLIENT_ID,
  AUTH0_DOMAIN as ENV_AUTH0_DOMAIN,
} from '@env';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

const AUTH0_DOMAIN = ENV_AUTH0_DOMAIN || '';
const AUTH0_CLIENT_ID = ENV_AUTH0_CLIENT_ID || '';
const AUTH0_AUDIENCE = ENV_AUTH0_AUDIENCE || '';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@mokkannada/auth';
const PKCE_KEY = '@mokkannada/pkce';
const AuthContext = createContext(null);

const isAuth0Configured = Boolean(AUTH0_DOMAIN && AUTH0_CLIENT_ID);
const GOOGLE_CONNECTION = 'google-oauth2';

const getDiscovery = (domain) => ({
  authorizationEndpoint: `https://${domain}/authorize`,
  tokenEndpoint: `https://${domain}/oauth/token`,
  revocationEndpoint: `https://${domain}/oauth/revoke`,
  endSessionEndpoint: `https://${domain}/v2/logout`,
});

const getRedirectUri = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}`;
  }
  return AuthSession.makeRedirectUri({
    scheme: 'kannadaspeakingapp',
    path: 'callback',
  });
};

const clearAuthParamsFromUrl = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('code') && !url.searchParams.has('error') && !url.searchParams.has('state')) {
    return;
  }
  url.search = '';
  url.hash = '';
  window.history.replaceState({}, document.title, url.pathname);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const handlingCallback = useRef(false);

  const redirectUri = useMemo(() => getRedirectUri(), []);
  const discovery = useMemo(
    () => (isAuth0Configured ? getDiscovery(AUTH0_DOMAIN) : null),
    []
  );

  const extraParams = useMemo(() => {
    const params = { connection: GOOGLE_CONNECTION };
    if (AUTH0_AUDIENCE) params.audience = AUTH0_AUDIENCE;
    return params;
  }, []);

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID || 'placeholder',
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      usePKCE: true,
      extraParams,
    },
    discovery
  );

  const persistSession = useCallback(async (session) => {
    if (!session) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, []);

  const applySession = useCallback(async (session) => {
    setUser(session?.user ?? null);
    setAccessToken(session?.accessToken ?? null);
    await persistSession(session);
  }, [persistSession]);

  const fetchUserInfo = useCallback(async (token) => {
    const res = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Failed to load user profile');
    }
    return res.json();
  }, []);

  const completeWithCode = useCallback(async (code, codeVerifier) => {
    const tokenResult = await AuthSession.exchangeCodeAsync(
      {
        clientId: AUTH0_CLIENT_ID,
        code,
        redirectUri,
        extraParams: {
          code_verifier: codeVerifier || '',
        },
      },
      discovery
    );

    const profile = await fetchUserInfo(tokenResult.accessToken);
    await applySession({
      user: {
        name: profile.name || profile.nickname || profile.email,
        email: profile.email,
        picture: profile.picture,
        sub: profile.sub,
      },
      accessToken: tokenResult.accessToken,
      idToken: tokenResult.idToken,
      refreshToken: tokenResult.refreshToken,
    });
  }, [redirectUri, discovery, fetchUserInfo, applySession]);

  // Restore session + handle redirect callback (full-page Google login return)
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && isAuth0Configured) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          const authError = params.get('error_description') || params.get('error');

          if (authError) {
            setError(authError);
            clearAuthParamsFromUrl();
          } else if (code && !handlingCallback.current) {
            handlingCallback.current = true;
            setIsLoading(true);
            const rawPkce = await AsyncStorage.getItem(PKCE_KEY);
            const pkce = rawPkce ? JSON.parse(rawPkce) : null;
            await AsyncStorage.removeItem(PKCE_KEY);
            clearAuthParamsFromUrl();
            await completeWithCode(code, pkce?.codeVerifier);
            setIsLoading(false);
            return;
          }
        }

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          setUser(session.user ?? null);
          setAccessToken(session.accessToken ?? null);
        }
      } catch (e) {
        console.warn('Auth bootstrap failed', e);
        setError(e.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [completeWithCode]);

  const login = useCallback(async () => {
    if (!isAuth0Configured) {
      setError('Auth0 is not configured. Add AUTH0_DOMAIN and AUTH0_CLIENT_ID to .env');
      return;
    }
    if (!request || !discovery) {
      setError('Login is still preparing. Try again in a moment.');
      return;
    }

    setError(null);

    try {
      // Persist PKCE verifier before leaving this page (required for redirect flow)
      await AsyncStorage.setItem(
        PKCE_KEY,
        JSON.stringify({
          codeVerifier: request.codeVerifier,
          redirectUri,
        })
      );

      const authUrl = await request.makeAuthUrlAsync(discovery);

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Full-page redirect — no popup (same tab → Google → back)
        window.location.assign(authUrl);
        return;
      }

      const result = await promptAsync({ useProxy: false, showInRecents: true });
      if (result?.type === 'success' && result.params?.code) {
        await completeWithCode(result.params.code, request.codeVerifier);
        await AsyncStorage.removeItem(PKCE_KEY);
      } else if (result?.type === 'error') {
        setError(result.error?.message || 'Login failed');
      }
    } catch (e) {
      setError(e.message || 'Login failed');
    }
  }, [request, discovery, promptAsync, redirectUri, completeWithCode]);

  const logout = useCallback(async () => {
    setError(null);
    await applySession(null);
    await AsyncStorage.removeItem(PKCE_KEY);

    if (isAuth0Configured && Platform.OS === 'web' && typeof window !== 'undefined') {
      const returnTo = encodeURIComponent(window.location.origin);
      window.location.href = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
    }
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(user),
      isAuth0Configured,
      error,
      login,
      logout,
      redirectUri,
      loginReady: Boolean(request),
    }),
    [user, accessToken, isLoading, error, login, logout, redirectUri, request]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
