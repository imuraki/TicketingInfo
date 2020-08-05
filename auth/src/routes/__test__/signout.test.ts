import request from 'supertest';
import { app } from '../../app';

it('fails when email doesnt exist is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  console.log(response.get('Set-Cookie'));
});
