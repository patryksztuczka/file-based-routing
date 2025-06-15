import { app } from './app';
import { PORT } from './utils/constants';

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
};

startServer();
