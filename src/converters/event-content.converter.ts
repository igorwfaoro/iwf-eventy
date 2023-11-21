import { EventContent, EventContentImage } from '@prisma/client';
import { EventContentViewModel } from '../models/view-models/event-content.view-model';
import { eventContentImageConverter } from './event-content-image.converter';

export type EventContentConverterModel = EventContent & {
  images: EventContentImage[] | undefined;
};

export const eventContentConverter = {
  modelToViewModel: (
    model: EventContentConverterModel
  ): EventContentViewModel => ({
    id: Number(model.id),
    primaryColor: model.primaryColor,
    logoImage: model.logoImage,
    icon: model.icon,
    spotifyPlaylistUrl: model.spotifyPlaylistUrl,
    bannerImage: model.bannerImage,
    images: model.images?.map(eventContentImageConverter.modelToViewModel),
  }),
};
