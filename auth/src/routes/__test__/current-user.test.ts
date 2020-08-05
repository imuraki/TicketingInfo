import request from 'supertest';
import { app } from '../../app';

it('fails when email doesnt exist is supplied', async () => {
  const signupresponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asaddadd@p.com',
      password: '123456789',
    })
    .expect(201);

  const cookie = signupresponse.get('Set-Cookie');

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  console.log(response.body);
});
