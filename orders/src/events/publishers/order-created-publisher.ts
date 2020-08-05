import { Publisher, OrderCreatedEvent, Subjects } from '@ticketingdev/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
