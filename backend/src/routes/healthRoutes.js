import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (request, response) => {
  response.json({
    success: true,
    service: 'TeraPlus API',
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;