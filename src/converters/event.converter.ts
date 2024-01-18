import {
  Event,
  EventAddress,
  EventFinancial,
  EventHandbook,
  EventType,
  EventWeddingDetail,
  Gift
} from '@prisma/client';
import { EventDetailViewModel } from '../models/view-models/event-detail.view-model';
import { eventWeddingDetailConverter } from './event-wedding-detail.converter';
import { eventTypeLabel } from '../util/helpers/event-type.helper';
import { giftConverter } from './gift.converter';
import { eventAddressConverter } from './event-address.converter';
import {
  EventContentConverterModel,
  eventContentConverter
} from './event-content.converter';
import { eventFinancialConverter } from './event-financial.converter';
import { EventViewModel } from '../models/view-models/event.view-model';
import { eventHandbookConverter } from './event-handbook.converter';

export type EventConverterModel = Event & {
  content?: EventContentConverterModel;
  address?: EventAddress;
  financial?: EventFinancial | null;
  weddingDetail?: EventWeddingDetail | null;
  gifts?: Gift[];
  handbooks?: EventHandbook[] | null;
};

interface EventDetailInclude {
  hasGifts: boolean;
  hasInvitations: boolean;
  hasHandbooks: boolean;
}

export const eventConverter = {
  modelDetailViewModel: (
    model: EventConverterModel,
    { hasGifts, hasInvitations, hasHandbooks }: EventDetailInclude
  ): EventDetailViewModel => ({
    id: Number(model.id),
    eventType: model.eventType,
    date: model.date,
    slug: model.slug,

    address: model.address
      ? eventAddressConverter.modelToViewModel(model.address)
      : undefined,

    content: model.content
      ? eventContentConverter.modelToViewModel(model.content)
      : undefined,

    financial: model.financial
      ? eventFinancialConverter.modelToViewModel(model.financial)
      : undefined,

    weddingDetail: model.weddingDetail
      ? eventWeddingDetailConverter.modelToViewModel(model.weddingDetail)
      : undefined,

    gifts: model.gifts?.map(giftConverter.modelToViewModel),

    handbooks: model.handbooks?.map(eventHandbookConverter.modelToViewModel),

    createdAt: model.createdAt,

    titleDescription: {
      [EventType.WEDDING]: `${eventTypeLabel[EventType.WEDDING]} ${[
        model.weddingDetail?.groomName,
        model.weddingDetail?.brideName
      ]
        .sort()
        .join(' & ')}`
    }[model.eventType],

    hasGifts,
    hasInvitations,
    hasHandbooks
  }),

  modelViewModel: (model: EventConverterModel): EventViewModel => ({
    id: Number(model.id),
    eventType: model.eventType,
    date: model.date,
    slug: model.slug,

    address: model.address
      ? eventAddressConverter.modelToViewModel(model.address)
      : undefined,

    content: model.content
      ? eventContentConverter.modelToViewModel(model.content)
      : undefined,

    financial: model.financial
      ? eventFinancialConverter.modelToViewModel(model.financial)
      : undefined,

    weddingDetail: model.weddingDetail
      ? eventWeddingDetailConverter.modelToViewModel(model.weddingDetail)
      : undefined,

    createdAt: model.createdAt,

    titleDescription: {
      [EventType.WEDDING]: `${eventTypeLabel[EventType.WEDDING]} ${model
        .weddingDetail?.groomName} & ${model.weddingDetail?.brideName}`
    }[model.eventType]
  })
};
