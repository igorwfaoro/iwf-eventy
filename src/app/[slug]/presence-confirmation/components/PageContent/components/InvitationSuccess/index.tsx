import ConfettiExplosion from 'react-confetti-explosion';
import './index.scss';
import Button from '../../../../../../../components/Button';
import { usePresenceConfirmationContext } from '../../contexts/PresenceConfirmationContext';

export default function InvitationSuccess() {
  const { event } = usePresenceConfirmationContext();

  const confettiDuration = 3000;
  const confettiParticleCount = 150;
  const confettiWidth = window.innerWidth + 200;

  return (
    <div id="invitation-success">
      <div className="content">
        <div className="message-toast">
          🎉👰 Parabéns! Sua confirmação de presença foi registrada com sucesso!
          🤵🎉
        </div>

        <div className="success-message">
          <p>
            Estamos animados para compartilhar este dia especial com você e sua
            presença tornará esse momento ainda mais memorável. Mal podemos
            esperar para celebrar juntos!
          </p>
          <p>
            Se você tiver mais alguma pergunta ou precisar de informações
            adicionais, sinta-se à vontade para entrar em contato conosco.
            Agora, é só aguardar ansiosamente pela data do evento. Até lá!
          </p>
        </div>

        <Button theme="primary" variant="outlined" link={`/${event.slug}`}>
          Ir para início
        </Button>
      </div>

      <div className="confetti">
        <ConfettiExplosion
          duration={confettiDuration}
          particleCount={confettiParticleCount}
          width={confettiWidth}
        />
      </div>
    </div>
  );
}
