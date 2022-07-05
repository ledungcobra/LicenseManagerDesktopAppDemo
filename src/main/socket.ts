import http from 'http';
import sockjs from 'sockjs';
const serverPort = 3005;

export type Response = {
  channel: string;
  message: string;
  data: any;
};
export function socketListen(event: any) {
  const createSocketJsServer = () =>
    sockjs.createServer({
      sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js',
      websocket: true,
    });

  const socket = createSocketJsServer();
  const server = http.createServer();
  socket.installHandlers(server, { prefix: '/activate' });
  socket.on('connection', (conn) => {
    conn.on('done', (data: any) => {
      server.close();
    });
    conn.on('close', () => {
      console.log('Client close connection');
      // server.close();
    });
    conn.on('data', (data) => {
      try {
        const response = JSON.parse(data) as Response;
        event.reply('open-browser-reply', response);
        server.close();
      } catch (e) {}
    });
  });

  server.listen(serverPort, () => {
    console.log('Socket listening on port ' + serverPort);
  });
  return server;
}
