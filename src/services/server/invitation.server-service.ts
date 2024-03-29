import { invitationConverter } from '../../converters/invitation.converter';
import { prisma } from '../../data/db';
import { UpdateGuestsConfirmationInputModel } from '../../models/input-models/update-guests-confirmation.input-model';
import { InvitationViewModel } from '../../models/view-models/invitation.view-model';

export const createInvitationServerService = () => {
  const getByDescription = async (
    eventId: number,
    description: string
  ): Promise<InvitationViewModel> => {
    const invitation = await prisma.invitation.findFirstOrThrow({
      where: {
        eventId,
        description: {
          equals: description,
          mode: 'insensitive'
        }
      },
      include: {
        guests: true
      }
    });

    return invitationConverter.modelToViewModel(invitation);
  };

  const updateGuestsConfirmation = async (
    input: UpdateGuestsConfirmationInputModel
  ) => {
    const getConfig = (isConfirmed: boolean) => ({
      where: {
        invitationId: input.invitationId,
        id: {
          in: input.guests
            .filter((g) => g.isConfirmed === isConfirmed)
            .map((g) => g.id)
        }
      },
      data: {
        isConfirmed
      }
    });

    await prisma.$transaction([
      prisma.guest.updateMany(getConfig(true)),
      prisma.guest.updateMany(getConfig(false))
    ]);
  };

  return {
    getByDescription,
    updateGuestsConfirmation
  };
};
