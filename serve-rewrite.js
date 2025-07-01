const history = require('connect-history-api-fallback');
const http = require('http-server');
const path = require('path');

// Create the server
const server = http.createServer({
  root: path.join(__dirname, 'dist'),
  robots: true,
  cors: true,
  showDir: true,
  autoIndex: true,
});

// Clean URLs: /foo -> /foo.html, /bar/ -> /bar/index.html
server.use(
  history({
    rewrites: [
      { from: /^\/(.*)\/$/, to: context => `/${context.match[1]}/index.html` },
      { from: /^\/(.*)$/, to: context => `/${context.match[1]}.html` },
    ],
  })
);

server.listen(5000, () => {
  console.log('Serving on http://localhost:5000');
});
