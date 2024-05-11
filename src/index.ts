import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

import express, { Request, Response } from 'express';
import cors from 'cors';

import { ROOT_DIR } from './utils/constants';
import {
  DETECT_SQUARE_BRACKETS_REGEX,
  DYNAMIC_ROUTE_REGEX
} from './utils/regex';

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const handleRoute = async (filePath: string, req: Request, res: Response) => {
  try {
    const module = await import(`file://${filePath}`);

    const httpMethod = req.method;

    let data = null;

    if (module) {
      if (module[httpMethod]) {
        data = await module[httpMethod](req, res);
      } else {
        res.status(404).send('Metohd not supported');
      }
    } else {
      res.status(404).send('Route not found');
    }

    return data;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

app.all('/*', async (req, res) => {
  let filePath = `${__dirname}/${ROOT_DIR}${req.url}`;

  const isFileExist = existsSync(filePath);
  console.log(filePath);

  if (isFileExist) {
    const result = await handleRoute(`${filePath}/index.ts`, req, res);
    res.send(result);
  } else {
    const requestPath = req.url.split('/').filter(Boolean);

    const dirFiles = await readdir(
      `${__dirname}/${ROOT_DIR}/${requestPath.at(-2)}`
    );

    const dynamicRoute = dirFiles.find((file) =>
      file.match(DYNAMIC_ROUTE_REGEX)
    );

    if (dynamicRoute) {
      filePath = `${__dirname}/${ROOT_DIR}/${requestPath.join('/').replace(requestPath.at(-1), dynamicRoute)}`;

      req.params[dynamicRoute.replace(DETECT_SQUARE_BRACKETS_REGEX, '')] =
        requestPath.at(-1);

      const result = await handleRoute(`${filePath}/index.ts`, req, res);
      res.send(result);
    }

    res.status(404).send('Route not found');
  }
});

const initialServer = () => {
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
};

initialServer();
