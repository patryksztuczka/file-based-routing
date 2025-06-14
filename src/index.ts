import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import express, { Request, Response } from 'express';
import cors from 'cors';

import { PORT, RESOURCES_DIR } from './utils/constants';
import { DYNAMIC_ROUTE_REGEX } from './utils/regex';

const app = express();

app.use(cors());

app.use(express.json());

/**
 * Check if a resource (route file) exists in the file system
 * @param reqUrl - The requested URL path
 * @returns boolean indicating if the resource exists
 */
const isResourceExists = (reqUrl: string) => {
  const resourcePath = path.join(__dirname, RESOURCES_DIR, reqUrl);
  return existsSync(path.join(resourcePath));
};

/**
 * Catch-all route handler that implements file-based routing
 * Maps URL paths to corresponding files in the routes directory
 * Supports both static routes and dynamic routes with parameters
 */
app.all('/*', async (req: Request, res: Response) => {
  try {
    const reqMethod = req.method;

    if (isResourceExists(req.url)) {
      // Special handling for root path '/'
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
      // No direct match - check for dynamic routes

      // Split URL into segments, removing empty strings
      const reqUrlSegments = req.url.split('/').filter(Boolean);
      let existingPath: string = '';

      // Traverse each URL segment to build the route path
      for (const segment of reqUrlSegments) {
        const currentPath = existingPath + `/${segment}`;

        // Check if current path segment exists as a static route
        if (isResourceExists(currentPath)) {
          existingPath += `/${segment}`;
        } else {
          // Current segment doesn't exist - look for dynamic route

          // Read directory contents to find dynamic route files
          const dirFiles = await readdir(
            path.join(__dirname, RESOURCES_DIR, existingPath)
          );

          // Find file/folder matching dynamic route pattern [paramName]
          const dynamicRoute = dirFiles.find((file) =>
            file.match(DYNAMIC_ROUTE_REGEX)
          );

          if (!dynamicRoute) {
            res.status(404).send(`Resource not found`);
            return;
          }

          // Extract parameter name from [paramName] and inject into req.params
          // Remove brackets to get clean parameter name
          const paramName = dynamicRoute
            .replaceAll('[', '')
            .replaceAll(']', '');
          req.params[paramName] = segment;

          // Continue building path with dynamic route folder
          existingPath += `/${dynamicRoute}`;
        }
      }

      // Import the final resolved route module
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
