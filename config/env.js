const path = require('path');

try {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (e) {
  // optional
}

module.exports = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || '',
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || '',
  APP_NAME: process.env.APP_NAME || 'KannadaSpeakingApp',
  APP_ENV: process.env.APP_ENV || 'development',
};
