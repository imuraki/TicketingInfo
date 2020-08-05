import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketingdev/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
