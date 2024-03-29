import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import Field from '../../../../../../../../../../components/Field/Field';
import Button from '../../../../../../../../../../components/Button/Button';
import { createEventClientService } from '../../../../../../../../../../services/client/event.client-service';
import { useLoader } from '../../../../../../../../../../contexts/LoaderContext';
import { useToast } from '../../../../../../../../../../contexts/ToastContext';
import { EditModalResult } from '../../types/edit-modal-result';
import { EditModalProps } from '../../types/edit-modal-props';
import { fileToDataURL } from '../../../../../../../../../../util/helpers/file.helper';

interface EventContentEditModalProps extends EditModalProps {}
interface EventContentEditModalResult extends EditModalResult {}

const formSchema = z.object({
  primaryColor: z.string().min(1, 'Informe a cor principal do evento')
});

type FormSchema = z.infer<typeof formSchema>;

export default function EventContentEditModal({
  event,
  modalRef
}: EventContentEditModalProps) {
  const eventClientService = createEventClientService();
  const loader = useLoader();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  const [bannerImageFile, setBannerImageFile] = useState<File>();
  const [bannerImageThumbnail, setBannerImageThumbnail] = useState<string>();

  const [logoImageFile, setLogoImageFile] = useState<File>();
  const [logoImageThumbnail, setLogoImageThumbnail] = useState<string>();

  useEffect(() => {
    setValue('primaryColor', event.content!.primaryColor);

    setBannerImageThumbnail(event.content?.bannerImage || undefined);
    setLogoImageThumbnail(event.content?.logoImage || undefined);
  }, []);

  const handleInputFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    setFileState: Dispatch<SetStateAction<File | undefined>>,
    setThumbnailState: Dispatch<SetStateAction<string | undefined>>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    setFileState(file);
    setThumbnailState(await fileToDataURL(file));
  };

  const handleFormSubmit = (data: FormSchema) => {
    loader.show();

    eventClientService
      .update(event.id, {
        inputData: {
          content: {
            primaryColor: data.primaryColor
          }
        },
        inputFiles: {
          bannerImage: bannerImageFile,
          logoImage: logoImageFile
        }
      })
      .then(() => {
        toast.open('Salvo', 'success');
        modalRef.close({ edited: true } as EventContentEditModalResult);
      })
      .catch((error) => {
        toast.open('Erro ao salvar', 'error');
        console.error(error);
      })
      .finally(() => loader.hide());
  };

  const color = watch().primaryColor || event.content?.primaryColor;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mt-4 flex flex-col gap-2 w-full"
    >
      <Field>
        <Field.Label>Qual é a cor principal do seu evento?</Field.Label>
        <div className="flex items-center gap-2">
          <Field.Input {...register('primaryColor')} type="color" />
          {color && (
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
        <Field.Error>{errors.primaryColor?.message}</Field.Error>
      </Field>

      <Field>
        <Field.Label>Escolha um banner para seu evento (opcional)</Field.Label>
        <Field.HelpText>
          Você pode definir isso depois se preferir
        </Field.HelpText>
        <Field.Input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={(event) =>
            handleInputFileChange(
              event,
              setBannerImageFile,
              setBannerImageThumbnail
            )
          }
        />
      </Field>

      <div>
        {bannerImageThumbnail && (
          <img src={bannerImageThumbnail} className="h-28 mb-6" />
        )}
      </div>

      <Field>
        <Field.Label>Escolha uma logo para seu evento (opcional)</Field.Label>
        <Field.HelpText>
          Você pode definir isso depois se preferir
        </Field.HelpText>
        <Field.Input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={(event) =>
            handleInputFileChange(
              event,
              setLogoImageFile,
              setLogoImageThumbnail
            )
          }
        />
      </Field>

      <div>
        {logoImageThumbnail && (
          <img src={logoImageThumbnail} className="h-28 mb-6" />
        )}
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
