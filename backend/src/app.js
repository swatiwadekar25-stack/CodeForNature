import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import communityReportRoutes from '../routes/communityReportRoutes.js';
import forestRoutes from '../routes/forestRoutes.js';
import statisticsRoutes from '../routes/statisticsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/forests', forestRoutes);
app.use('/api/reports', communityReportRoutes);
app.use('/api/statistics', statisticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;