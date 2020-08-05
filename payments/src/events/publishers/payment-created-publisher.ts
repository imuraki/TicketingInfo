import { Subjects, Publisher, PaymentCreatedEvent } from '@ticketingdev/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
