import { Publisher, Subjects, TicketCreatedEvent } from '@ticketingdev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
