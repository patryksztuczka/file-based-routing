import { existsSync, read } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import express, { Request, Response } from 'express';
import cors from 'cors';

import { PORT, RESOURCES_DIR } from './utils/constants';
import { DYNAMIC_ROUTE_REGEX } from './utils/regex';

const app = express();

app.use(cors());

app.use(express.json());

const isResourceExists = (reqUrl: string) => {
  const resourcePath = path.join(__dirname, RESOURCES_DIR, reqUrl);
  return existsSync(path.join(resourcePath));
};

app.all('/*', async (req: Request, res: Response) => {
  try {
    const reqMethod = req.method;

    if (isResourceExists(req.url)) {
      if (req.url === '/') {
        const rootDirFiles = await readdir(path.join(__dirname, RESOURCES_DIR));
        if (!rootDirFiles.includes('index.ts')) {
          res.status(404).send(`Resource not found`);
          return;
        }
      }

      const module = await import(
        `file://${path.join(__dirname, RESOURCES_DIR, req.url)}`
      );

      const handler = module[reqMethod];

      if (!handler) {
        res.status(404).send(`${reqMethod} method is not supported`);
        return;
      }
      res.status(200).send(await handler());
    } else {
      const reqUrlSegments = req.url.split('/').filter(Boolean);
      let existingPath: string = '';
      for (const segment of reqUrlSegments) {
        const currentPath = existingPath + `/${segment}`;
        if (isResourceExists(currentPath)) {
          existingPath += `/${segment}`;
        } else {
          const dirFiles = await readdir(
            path.join(__dirname, RESOURCES_DIR, existingPath)
          );

          const dynamicRoute = dirFiles.find((file) =>
            file.match(DYNAMIC_ROUTE_REGEX)
          );

          if (!dynamicRoute) {
            res.status(404).send(`Resource not found`);
            return;
          }

          req.params[dynamicRoute.replaceAll('[', '').replaceAll(']', '')] =
            segment;

          existingPath += `/${dynamicRoute}`;
        }
      }

      const module = await import(
        `file://${path.join(__dirname, RESOURCES_DIR, existingPath)}`
      );

      const handler = module[reqMethod];

      if (!handler) {
        res.status(404).send(`${reqMethod} method is not supported`);
        return;
      }

      res.status(200).send(await handler(req));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

const initialServer = () => {
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
};

initialServer();
