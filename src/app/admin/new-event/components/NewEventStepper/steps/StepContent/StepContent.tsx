import { z } from 'zod';
import Button from '../../../../../../../components/Button/Button';
import Field from '../../../../../../../components/Field/Field';
import { useNewEventContext } from '../../../../contexts/NewEventContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { fileToDataURL } from '../../../../../../../util/helpers/file.helper';

interface StepContentProps {
  index: number;
}

const formContentSchema = z.object({
  primaryColor: z.string().min(1, 'Informe a cor principal do evento')
});

type FormContentSchema = z.infer<typeof formContentSchema>;

export default function StepContent({ index }: StepContentProps) {
  const {
    stepNext,
    stepPrev,
    setEventCreateData,
    eventCreateData,
    setStepComplete,

    bannerImageFile,
    setBannerImageFile,
    bannerImageThumbnail,
    setBannerImageThumbnail,

    logoImageFile,
    setLogoImageFile,
    logoImageThumbnail,
    setLogoImageThumbnail
  } = useNewEventContext();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch
  } = useForm<FormContentSchema>({
    resolver: zodResolver(formContentSchema)
  });

  useEffect(() => {
    if (eventCreateData?.content?.primaryColor) {
      setValue('primaryColor', eventCreateData.content.primaryColor);

      setBannerImageThumbnail(bannerImageFile?.name);
      setLogoImageThumbnail(logoImageFile?.name);
    }
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

  const handleFormSubmit = (data: FormContentSchema) => {
    setEventCreateData((curr) => ({
      ...curr,
      content: {
        primaryColor: data.primaryColor
      }
    }));

    setStepComplete(index);
    stepNext();
  };

  const color = watch('primaryColor');

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mt-4 flex flex-col gap-2"
    >
      <Field>
        <Field.Label>Qual é a cor principal do seu evento?</Field.Label>
        <div className="flex items-center gap-2">
          <Field.Input {...register('primaryColor')} type="color" />
          {dirtyFields.primaryColor && color && (
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

      <div className="flex justify-between">
        <Button theme="light" type="button" onClick={stepPrev}>
          Voltar
        </Button>
        <Button type="submit">Próximo</Button>
      </div>
    </form>
  );
}
