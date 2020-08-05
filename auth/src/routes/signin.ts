import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@ticketingdev/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Ypu must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(
      password,
      existingUser.password
    );

    if (!passwordsMatch) throw new BadRequestError('Invalid Credentials');

    //JWT
    const userjwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // req.session = {
    //   jwt: userjwt,
    // };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
