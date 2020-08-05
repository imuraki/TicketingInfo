import request from 'supertest';
import { app } from '../../app';
import { createTicketRouter } from '../new';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'asdf',
    price: 10,
  });
};

it('return the tickets present in db', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
