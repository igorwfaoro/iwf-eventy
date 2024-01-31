import { prisma } from '../../data/db';
import { GiftViewModel } from '../../models/view-models/gift.view-model';
import { giftConverter } from '../../converters/gift.converter';
import { GiftInputModel } from '../../models/input-models/gift.input-model';
import { AuthUser } from '../../auth/auth-user';

interface ExtraIncludes {
  gifts?: boolean;
  financial?: boolean;
  handbooks?: boolean;
}

export const createGiftServerService = () => {
  const getAllByEvent = async (user: AuthUser, eventId: number): Promise<GiftViewModel[]> => {
    const gifts = await prisma.gift.findMany({
      where: {
        eventId
      }
    });

    return gifts.map(giftConverter.modelToViewModel);
  };

  const getById = async (
    eventId: number,
    id: number
  ): Promise<GiftViewModel> => {
    const gift = await prisma.gift.findUnique({
      where: {
        eventId,
        id
      }
    });

    if (!gift) {
      throw new Error('Gift not found');
    }

    return giftConverter.modelToViewModel(gift);
  };

  const create = async (
    eventId: number,
    input: GiftInputModel
  ): Promise<GiftViewModel> => {
    const gift = await prisma.gift.create({
      data: {
        eventId,
        description: input.description,
        image: input.image,
        price: input.price
      }
    });

    return giftConverter.modelToViewModel(gift);
  };

  const update = async (
    eventId: number,
    id: number,
    input: GiftInputModel
  ): Promise<GiftViewModel> => {
    const gift = await prisma.gift.update({
      where: {
        eventId,
        id
      },
      data: {
        description: input.description,
        image: input.image,
        price: input.price
      }
    });

    return giftConverter.modelToViewModel(gift);
  };

  const remove = async (eventId: number, id: number): Promise<void> => {
    await prisma.gift.delete({
      where: {
        eventId,
        id
      }
    });
  };

  return {
    getAllByEvent,
    getById,
    create,
    update,
    remove
  };
};