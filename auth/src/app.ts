import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { currentUserRouter } from './routes/current-user';
import { errorHandler, NotFoundError } from '@ticketingdev/common';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use('/api/users/signin', signInRouter);
app.use('/api/users/signout', signOutRouter);
app.use('/api/users/signup', signUpRouter);
app.use('/api/users/currentuser', currentUserRouter);

app.get('*', async (req, res) => {
  res.send(req.path);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
