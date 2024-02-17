import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from '@ybticketing/common';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      price: req.body.price,
      title: req.body.title,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
