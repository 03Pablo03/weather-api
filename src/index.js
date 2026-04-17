import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config/index.js';
import weatherRouter from './routes/weather.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = join(__dirname, '..', 'public');

const app = express();

app.use(express.static(publicPath));
app.use('/api', weatherRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', status: 404 });
});

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isDirectRun) {
  app.listen(config.port, () => {
    console.log(`Weather API running on http://localhost:${config.port}`);
  });
}

export default app;
