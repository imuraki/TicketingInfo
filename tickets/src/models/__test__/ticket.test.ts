import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  //Create a instance of ticket

  const ticket = Ticket.build({
    title: 'ttt',
    price: 10,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 20 });
  secondInstance!.set({ price: 30 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach here');
});
