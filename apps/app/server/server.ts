import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import { getServer } from '@apps/shared';
import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { networkInterfaces, type NetworkInterfaceInfo } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import bootstrap from '../src/main.server';
import { ConfigService } from '@nestjs/config';
import { NAVIGATOR } from '@app/frontend-utils';
import cookieParser from 'cookie-parser';
import { REQUEST } from '@angular/core';
import { AddressInfo } from 'net';

// The Express app is exported so that it can be used by serverless Functions.
export async function app() {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const allowedHost = process.env['BASE_URL'] ?? 'localhost';
  const localIPs = Object.values(networkInterfaces())
    .flat()
    .filter((iface): iface is NetworkInterfaceInfo => Boolean(iface && !iface.internal))
    .map((iface) => iface.address);
  const commonEngine = new CommonEngine({
    allowedHosts: [allowedHost, 'localhost', 'gladman.purr.dev', '127.0.0.1', ...localIPs],
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Add cookie parser middleware
  server.use(cookieParser());

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    }),
  );

  // All regular routes use the Angular engine for rendering
  // except for /api/** routes
  server.use(async (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    if (shouldSkip(req.originalUrl)) {
      // Handle API routes separately
      next();
    } else {
      try {
        const userAgent = req.headers['user-agent'];
        const html = await commonEngine.render({
          bootstrap,
          documentFilePath: indexHtml,
          url: `${headers['x-forwarded-proto'] ?? protocol}://${headers['x-forwarded-host'] ?? headers.host}${originalUrl}`,
          publicPath: browserDistFolder,
          providers: [
            { provide: APP_BASE_HREF, useValue: baseUrl },
            {
              provide: REQUEST,
              useValue: {
                headers: {
                  get: (name: string) => {
                    if (name.toLowerCase() === 'cookie') {
                      return req.headers.cookie || '';
                    }
                    return req.headers[name.toLowerCase()];
                  },
                },
              },
            },
            { provide: 'RESPONSE', useValue: res },
            { provide: NAVIGATOR, useValue: userAgent },
          ],
        });
        res.send(html);
      } catch (err) {
        if (isRouteNotFoundError(err)) {
          res.status(404).send('Not Found');
          return;
        }

        next(err);
      }
    }
  });

  // setup NestJS app
  const adapter = new ExpressAdapter(server);
  const app = await getServer(adapter);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5000);

  await app.init();
  await app.listen(port, '0.0.0.0');  
  
  const { address } = app.getHttpServer().address() as AddressInfo;
  Logger.log(`Application is listening on http://${address}:${port}`, 'Bootstrap');
}

async function run(): Promise<void> {
  await app();
}

function shouldSkip(url: string) {
  if (url.startsWith('/api') || url.startsWith('/graphql') || url.startsWith('/.well-known')) {
    return true;
  }

  if (hasFileExtension(url)) {
    return true;
  }

  return false;
}

function hasFileExtension(url: string) {
  const pathname = new URL(url, 'http://localhost').pathname;
  const lastSegment = pathname.split('/').pop() ?? '';

  return lastSegment.includes('.');
}

function isRouteNotFoundError(error: unknown) {
  return error instanceof Error && 'code' in error && error.code === 4002;
}

run();
