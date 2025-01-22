// craco.config.js
module.exports = {
  webpack: {
    resolve: {
      fallback: {
        http: require.resolve('stream-http') // Fallback pour le module 'http'
      }
    }
  }
};
