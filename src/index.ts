import { existsSync } from 'node:fs';

import express from 'express';
import cors from 'cors';

import { ROOT_DIR } from './utils/constants';

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const handleRoute = async (filePath: string, req, res) => {
  try {
    const module = await import(`file://${filePath}`);

    const data = await module.handler(req, res);

    return data;
  } catch (error) {
    console.error(error);
  }
};

app.all('/*', async (req, res) => {
  const filePath = `${__dirname}/${ROOT_DIR}${req.url}`;

  const isFileExist = existsSync(filePath);

  if (isFileExist) {
    const result = await handleRoute(`${filePath}/index.ts`, req, res);

    res.send(result);
  } else {
    console.log('File does not exist');
  }
});

const initialServer = () => {
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
};

initialServer();
