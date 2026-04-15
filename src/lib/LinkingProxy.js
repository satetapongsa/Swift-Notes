// Pure Mock for expo-linking to bypass the "Unable to resolve ./Schemes" bug
const LinkingProxy = {
  createURL: (path) => {
    // จำลอง URL สำหรับ Web และ Native
    return `swift-notes://${path}`;
  },
  addEventListener: (type, handler) => {
    console.log('LinkingProxy: addEventListener', type);
    return { remove: () => {} };
  },
  getInitialURL: async () => {
    console.log('LinkingProxy: getInitialURL');
    return null;
  },
  parse: (url) => {
    console.log('LinkingProxy: parse', url);
    return { path: '', queryParams: {} };
  }
};

export default LinkingProxy;
