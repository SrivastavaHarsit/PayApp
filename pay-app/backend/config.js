require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret', // fallback for dev
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
};
