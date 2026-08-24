import type { Server } from 'node:http';

import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

const server: Server = app.listen(env.port, () => {
  console.log(`🚀 API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
});

/** Gracefully drain in-flight requests before exiting. */
function shutdown(signal: string): void {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
    console.log('Closed all connections. Bye.');
    process.exit(0);
  });

  // Force-exit if connections don't drain in time.
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
