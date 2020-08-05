import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  //Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: ticketOne._id,
    })
    .expect(201);

  //Create two orders as User 2#
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketTwo._id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketThree._id,
    })
    .expect(201);

  //Make request to get orders for User #2
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  //Make sure we only got the orders for User #2
  expect(res.body.length).toEqual(2);

  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);

  expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});
