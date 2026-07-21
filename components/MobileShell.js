import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const FRAME_BREAKPOINT = 520;

/**
 * On wide web viewports, centers the app in a mobile phone chrome.
 * On real phones / narrow screens, renders full-bleed.
 */
const MobileShell = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [isWebDesktop, setIsWebDesktop] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    const update = () => setIsWebDesktop(window.innerWidth >= FRAME_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (Platform.OS !== 'web' || !isWebDesktop) {
    return <View style={styles.fill}>{children}</View>;
  }

  const scale = Math.min(
    (width - 48) / PHONE_WIDTH,
    (height - 48) / PHONE_HEIGHT,
    1
  );

  return (
    <View style={styles.stage}>
      <View style={[styles.device, { transform: [{ scale }] }]}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1210',
  },
  device: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#2A211C',
    backgroundColor: '#000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
  },
  notch: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 28,
    borderRadius: 18,
    backgroundColor: '#111',
    zIndex: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    overflow: 'hidden',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 20,
  },
});

export default MobileShell;
