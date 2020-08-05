import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('fetches the Order', async () => {
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket._id,
    })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(orderResponse.body.id);
});

it('returns not authrized error for different user creating the order', async () => {
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket._id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
