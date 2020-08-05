import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus, Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('Cancel the order', async () => {
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

  const response = await request(app)
    .delete(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const deletedOrder = await Order.findById(orderResponse.body.id);
  expect(deletedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
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

  const response = await request(app)
    .delete(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
