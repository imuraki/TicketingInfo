import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { Subjects } from './events/subjects';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Published connected to NATS');
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 30,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify();
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
