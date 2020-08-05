import request from 'supertest';
import { app } from '../../app';

it('fails when email doesnt exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'asaddadd@p.com',
      password: '1234567890',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
