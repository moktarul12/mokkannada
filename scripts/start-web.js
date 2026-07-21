/**
 * Start Expo webpack web on http://localhost:1900
 * (Expo CLI --port only applies to Metro, not webpack.)
 */
const path = require('path');

async function main() {
  process.env.EXPO_NO_TELEMETRY = '1';
  process.chdir(path.resolve(__dirname, '..'));

  const { startAsync } = require('@expo/cli/build/src/start/startAsync');

  await startAsync(
    process.cwd(),
    {
      forceManifestType: null,
      privateKeyPath: null,
      android: false,
      web: true,
      ios: false,
      offline: true,
      clear: false,
      dev: true,
      https: false,
      maxWorkers: undefined,
      port: 1900,
      minify: false,
      devClient: false,
      scheme: null,
      host: 'localhost',
    },
    { webOnly: true }
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
