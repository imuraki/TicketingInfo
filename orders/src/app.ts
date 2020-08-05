import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@ticketingdev/common';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
  res.send(req.path);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
