import { requireAuth } from '@ybticketing/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/tickets', requireAuth, (res: Response, req: Request) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
