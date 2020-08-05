import { Publisher, Subjects, OrderCancelledEvent } from '@ticketingdev/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
