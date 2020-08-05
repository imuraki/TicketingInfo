import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the id doesnt exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Ticket 4', price: 10 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Ticket 4', price: 10 })
    .expect(401);
});

it('returns a 401 if the user doesnt own the ticket', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'New title', price: 20 })
    .expect(401);
});

it('returns a 400 if the invalid parameters are sent', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New title', price: -9 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);
});

it('Updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New title', price: 20 })
    .expect(200);

  const ticketResponse = await request(app).get(
    `/api/tickets/${response.body.id}`
  );
  expect(ticketResponse.body.title).toEqual('New title');
  expect(ticketResponse.body.price).toEqual(20);
});

it('publishes annd event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New title', price: 20 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New title', price: 20 })
    .expect(400);
});
