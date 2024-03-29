import { prisma } from '../../data/db';
import { EventDetailViewModel } from '../../models/view-models/event-detail.view-model';
import { eventConverter } from '../../converters/event.converter';
import { SearchEventsInputModel } from '../../models/input-models/search-events.input-model';
import { EventViewModel } from '../../models/view-models/event.view-model';
import { EventCreateInputModel } from '../../models/input-models/event-create.input-model';
import dayjs from 'dayjs';
import { eventSlug } from '../../util/helpers/event-slug.helper';
import { ExtraIncludesInputModel } from '../../models/input-models/extra-includes.input-model';
import { getAuthUser } from '../../auth/auth-config';
import { EventUpdateInputModel } from '../../models/input-models/event-update.input-model';
import {
  UploadFileResult,
  createFileServerService
} from './file.server-service';

export interface CreateUpdateEventParams<T> {
  inputData: T;
  inputFiles: {
    fileBannerImage?: File;
    fileLogoImage?: File;
  };
}

export const createEventServerService = () => {
  const get = async (
    eventWhere: any,
    extraIncludes: ExtraIncludesInputModel = {}
  ): Promise<EventDetailViewModel> => {
    const giftsCount = await prisma.gift.count({
      where: {
        event: eventWhere
      }
    });

    const invitationsCount = await prisma.invitation.count({
      where: {
        event: eventWhere
      }
    });

    const handbooksCount = await prisma.eventHandbook.count({
      where: {
        event: eventWhere
      }
    });

    const event = await prisma.event.findFirstOrThrow({
      where: eventWhere,
      include: {
        address: true,
        content: {
          include: {
            images: true
          }
        },
        weddingDetail: true,
        handbooks: extraIncludes.handbooks
          ? {
              select: {
                id: true,
                title: true,
                description: true
              }
            }
          : false,
        ...extraIncludes
      }
    });

    return eventConverter.modelDetailViewModel(event, {
      hasGifts: !!giftsCount,
      hasInvitations: !!invitationsCount,
      hasHandbooks: !!handbooksCount
    });
  };

  const getBySlug = async (
    slug: string,
    extraIncludes: ExtraIncludesInputModel = {}
  ): Promise<EventDetailViewModel> => {
    return get({ slug }, extraIncludes);
  };

  const getById = async (
    id: number,
    extraIncludes: ExtraIncludesInputModel = {}
  ): Promise<EventDetailViewModel> => {
    return get({ id }, extraIncludes);
  };

  const search = async ({
    query,
    index,
    limit
  }: SearchEventsInputModel): Promise<EventViewModel[]> => {
    const take = limit ?? 30;
    const skip = (index ?? 0) * take;
    const searchQuery = query?.toLowerCase().trim();

    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            address: {
              fullDescription: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          },
          {
            weddingDetail: {
              groomName: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          },
          {
            weddingDetail: {
              brideName: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include: {
        address: true,
        content: true,
        weddingDetail: true
      },
      skip,
      take
    });

    events[0].address;

    return events.map(eventConverter.modelViewModel);
  };

  const recommended = async (limit: number = 10): Promise<EventViewModel[]> => {
    const events = await prisma.event.findMany({
      include: {
        address: true,
        content: true,
        weddingDetail: true
      },
      take: limit
    });

    return events.map(eventConverter.modelViewModel);
  };

  const getByUser = async (): Promise<EventViewModel[]> => {
    const user = await getAuthUser();

    const userEvents = await prisma.userEvent.findMany({
      where: {
        userId: user.id
      },
      include: {
        event: {
          include: {
            address: true,
            content: true,
            weddingDetail: true
          }
        }
      }
    });

    return userEvents.map((ue) => eventConverter.modelViewModel(ue.event));
  };

  const create = async ({
    inputData,
    inputFiles
  }: CreateUpdateEventParams<EventCreateInputModel>): Promise<EventDetailViewModel> => {
    const fileService = createFileServerService();

    const user = await getAuthUser();

    let bannerImage: string | undefined = undefined;
    if (inputFiles.fileBannerImage)
      bannerImage = (
        await fileService.uploadFile(inputFiles.fileBannerImage, {
          fileExt: 'png'
        })
      ).fileLocation;

    let logoImage: string | undefined = undefined;
    if (inputFiles.fileLogoImage)
      logoImage = (
        await fileService.uploadFile(inputFiles.fileLogoImage, {
          fileExt: 'png'
        })
      ).fileLocation;

    const event = await prisma.event.create({
      data: {
        slug: eventSlug(inputData),
        eventType: inputData.eventType,
        date: dayjs(inputData.date).toDate(),
        address: {
          create: inputData.address
        },
        content: {
          create: {
            ...inputData.content,
            bannerImage,
            logoImage
          }
        },
        weddingDetail: {
          create: inputData.weddingDetail
        },
        usersEvent: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      }
    });

    return get({ id: event.id });
  };

  const update = async (
    id: number,
    { inputData, inputFiles }: CreateUpdateEventParams<EventUpdateInputModel>
  ): Promise<EventDetailViewModel> => {
    const fileService = createFileServerService();

    const user = await getAuthUser();

    const eventWhere = { id, usersEvent: { some: { userId: user.id } } };

    const event = await prisma.event.findFirstOrThrow({
      where: eventWhere,
      include: {
        content: true
      }
    });

    let bannerImage: string | undefined = undefined;
    if (inputFiles.fileBannerImage) {
      await fileService.deleteFile(event.content.bannerImage);

      bannerImage = (
        await fileService.uploadFile(inputFiles.fileBannerImage, {
          fileExt: 'png'
        })
      ).fileLocation;
    }

    let logoImage: string | undefined = undefined;
    if (inputFiles.fileLogoImage) {
      await fileService.deleteFile(event.content.logoImage);

      logoImage = (
        await fileService.uploadFile(inputFiles.fileLogoImage, {
          fileExt: 'png'
        })
      ).fileLocation;
    }

    await prisma.event.update({
      where: eventWhere,
      data: {
        eventType: inputData.eventType,
        date: dayjs(inputData.date).toDate(),
        address: {
          update: inputData.address
        },
        content: {
          update: {
            ...inputData.content,
            bannerImage,
            logoImage
          }
        },
        weddingDetail: {
          update: inputData.weddingDetail
        }
      }
    });

    return get({ id });
  };

  const verifyUser = async (eventId: number): Promise<void> => {
    const user = await getAuthUser();

    const userEvent = await prisma.userEvent.findFirst({
      where: {
        eventId,
        userId: user.id
      }
    });

    if (!userEvent) throw new Error('User is not a participant of this event');
  };

  return {
    getBySlug,
    getById,
    search,
    recommended,
    getByUser,
    create,
    update,
    verifyUser
  };
};
