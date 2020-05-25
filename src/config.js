export default {
  nodeEnv: process.env.NODE_ENV,
  publicURL: process.env.PUBLIC_URL || 'http://localhost:3000',
  apiURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  appURL: process.env.REACT_APP_URL || 'http://localhost:3000',
  careURL: process.env.REACT_APP_CARE_URL || 'http://localhost:4000',
};
