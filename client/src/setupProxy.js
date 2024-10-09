const { createProxyMiddleware } = require('http-proxy-middleware');
// module.exports = function(app) {
//   app.use(proxy('/v1/**', { target: 'http://localhost:8080/' }))
//   app.use(proxy('/socket.io', { target: 'http://localhost:5000/' }))
// }

module.exports = function(app) {
    app.use(
      '/v1/**',
      createProxyMiddleware({
        target: 'http://chattest.shomvob.co:8080',
        changeOrigin: true
      })
    );

    app.use(
        '/socket.io',
        createProxyMiddleware({
          target: 'http://chatwstest.shomvob.co:5000',
          changeOrigin: true
        })
      );

    app.use(
        '/stream',
        createProxyMiddleware({
            target: 'http://chatwstest.shomvob.co:5000',
            changeOrigin: true
        })
    );
  };