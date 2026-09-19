import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

await connectDatabase(env.mongoUri);

app.listen(env.port, () => {
  console.log(`TeraPlus API listening on http://localhost:${env.port}`);
});