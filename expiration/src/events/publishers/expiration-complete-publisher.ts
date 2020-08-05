import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@ticketingdev/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
