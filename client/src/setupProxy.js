const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use('/api', createProxyMiddleware(
    {
      target: 'https://localhost:4444',
      changeOrigin: true,
      headers: {
        verified: true,
        dn: '/C=US/ST=MD/L=Severna Park/O=KeyW Corporation/OU=Mobdata/CN=Test User',
      },
      secure: false,
      xfwd: true,
    },
  ));
}
