import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
      password: 'pasword',
    })
    .expect(201);
});

it('returns a 400 with invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcdpe.com',
      password: 'pasword',
    })
    .expect(400);
});

it('returns a 400 with invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
      password: 'pp',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
      password: '123456',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
      password: '123456',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abcd@e.com',
      password: '123456',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
