import { createServer } from 'vite';

const server = await createServer({
  root: './dev',
  configFile: false,
});

await server.listen();
server.printUrls();
