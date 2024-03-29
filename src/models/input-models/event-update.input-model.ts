import { EventType } from '.prisma/client';

export type EventUpdateInputModel = Partial<Event>;

interface Event {
  eventType?: EventType;
  date?: string;

  address?: Partial<Address>;
  content?: Partial<Content>;
  weddingDetail?: Partial<WeddingDetail>;
}

interface Address {
  shortDescription: string;
  fullDescription: string;
}

interface Content {
  primaryColor: string;
  bannerImage?: string;
  logoImage?: string;
}

interface WeddingDetail {
  brideName: string;
  groomName: string;
}
