import React, { useState, useRef, useEffect } from 'react';

const hospedagemButtons = [
  {
    label: 'Acomodações',
    info: 'Explore opções que vão desde quartos simples e funcionais até suítes de luxo com vista panorâmica. Perfeito para todo tipo de viajante.'
  },
  {
    label: 'Hotéis',
    info: 'Hospede-se em hotéis bem localizados, com café da manhã incluído, serviço de quarto, academia e outras comodidades para tornar sua estadia impecável.'
  },
  {
    label: 'Pousadas',
    info: 'Viva a experiência acolhedora de pousadas familiares, com ambientes rústicos e atendimento personalizado que fazem você se sentir em casa.'
  },
  {
    label: 'Resorts',
    info: 'Aproveite resorts com estrutura completa: piscinas, spa, áreas de lazer e atividades para crianças. Ideal para férias tranquilas e em grupo.'
  },
];

const footerButtons = [
  ...hospedagemButtons,
  {
    label: 'Apartamentos',
    info: 'Apartamentos equipados com cozinha, Wi-Fi e lavanderia, ideais para quem busca privacidade e praticidade em estadias prolongadas.'
  },
  {
    label: 'Passeios',
    info: 'Escolha entre city tours, passeios guiados, trilhas ecológicas ou tours gastronômicos que revelam os segredos do destino.'
  },
  {
    label: 'Aventuras',
    info: 'Mergulho, rafting, tirolesa, escalada e muito mais! Para os amantes de adrenalina e natureza.'
  },
  {
    label: 'Cultura Local',
    info: 'Participe de festivais, visite museus e monumentos históricos, e mergulhe nos costumes e tradições locais.'
  },
  {
    label: 'Gastronomia',
    info: 'Delicie-se com pratos típicos, chefs renomados e restaurantes escondidos que oferecem sabores autênticos e experiências únicas.'
  },
  {
    label: 'Atividades',
    info: 'Programações para todos os perfis: bem-estar, esportes, oficinas criativas, yoga ao pôr do sol, e muito mais.'
  },
  {
    label: 'Central de Ajuda',
    info: 'Suporte 24h, informações práticas, dúvidas frequentes e assistência personalizada durante sua jornada.'
  },
  {
    label: 'Cancelamento',
    info: 'Entenda prazos, taxas e condições de cancelamento com transparência e facilidade.'
  },
  {
    label: 'Opções de segurança',
    info: 'Tudo sobre protocolos sanitários, seguro viagem, suporte médico e medidas preventivas durante sua estadia.'
  },
  {
    label: 'Contato',
    info: 'Fale conosco via chat, telefone ou e-mail. Estamos sempre disponíveis para ajudar!'
  },
  {
    label: 'Feedback',
    info: 'Sua opinião é essencial! Compartilhe suas impressões para melhorarmos ainda mais seu atendimento.'
  },
  {
    label: 'Sobre nós',
    info: 'Conheça a trajetória da Horizon Travel, nosso propósito e os valores que guiam nosso trabalho.'
  },
  {
    label: 'Carreiras',
    info: 'Junte-se ao nosso time! Veja vagas abertas e benefícios para quem busca crescer no turismo.'
  },
  {
    label: 'Imprensa',
    info: 'Acesse press kits, releases e informações oficiais para veículos de comunicação e jornalistas.'
  },
  {
    label: 'Investidores',
    info: 'Descubra oportunidades de investimento e acompanhe os resultados da Horizon Travel.'
  },
  {
    label: 'Blog',
    info: 'Explore artigos, guias e curiosidades sobre destinos, experiências e tendências de viagem.'
  },
  {
    label: 'Privacidade',
    info: 'Saiba como protegemos seus dados e garantimos a segurança das suas informações pessoais.'
  },
  {
    label: 'Termos',
    info: 'Leia as condições de uso dos nossos serviços e saiba seus direitos e deveres como usuário.'
  },
  {
    label: 'Mapa do site',
    info: 'Encontre tudo facilmente com nosso guia de navegação por seções e serviços.'
  },
  {
    label: 'Informações da empresa',
    info: 'Confira dados institucionais, estrutura organizacional e canais oficiais da Horizon Travel.'
  },
];

const Footer: React.FC = () => {
  const [popup, setPopup] = useState<{ label: string; info: string } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopup(null);
      }
    }
    if (popup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popup]);

  // Função para abrir popup pelo nome do botão
  const handleButtonClick = (label: string) => {
    const btn = footerButtons.find(b => b.label === label);
    if (btn) setPopup(btn);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-800 py-12">
      <style>{`
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-effect rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Seção Hospedagem */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Hospedagem</h3>
              <ul className="space-y-2">
                {hospedagemButtons.map((btn) => (
                  <li key={btn.label}>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-sky-600 transition-colors text-sm w-full text-left"
                      onClick={() => handleButtonClick(btn.label)}
                    >
                      {btn.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="text-gray-600 hover:text-sky-600 transition-colors text-sm w-full text-left"
                    onClick={() => handleButtonClick('Apartamentos')}
                  >
                    Apartamentos
                  </button>
                </li>
              </ul>
            </div>
            {/* Seção Experiências */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Experiências</h3>
              <ul className="space-y-2">
                {['Passeios', 'Aventuras', 'Cultura Local', 'Gastronomia', 'Atividades'].map(label => (
                  <li key={label}>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-sky-600 transition-colors text-sm w-full text-left"
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Seção Suporte */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Suporte</h3>
              <ul className="space-y-2">
                {['Central de Ajuda', 'Cancelamento', 'Opções de segurança', 'Contato', 'Feedback'].map(label => (
                  <li key={label}>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-sky-600 transition-colors text-sm w-full text-left"
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Seção Empresa */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Horizon Travel</h3>
              <ul className="space-y-2">
                {['Sobre nós', 'Carreiras', 'Imprensa', 'Investidores', 'Blog'].map(label => (
                  <li key={label}>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-sky-600 transition-colors text-sm w-full text-left"
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Linha divisória */}
          <div className="border-t border-gray-300/30 pt-8">
            {/* Seção inferior com copyright e links legais */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>&copy; 2025 Horizon Travel, Inc.</span>
                <span>•</span>
                {['Privacidade', 'Termos', 'Mapa do site', 'Informações da empresa'].map(label => (
                  <React.Fragment key={label}>
                    <button
                      type="button"
                      className="hover:text-sky-600 transition-colors"
                      onClick={() => handleButtonClick(label)}
                    >
                      {label}
                    </button>
                    <span>•</span>
                  </React.Fragment>
                ))}
              </div>
              {/* Redes sociais (mantidas como estão) */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.45 8.87 8 9.8v-6.93h-2.4v-2.87H10V9.63c0-2.38 1.42-3.69 3.59-3.69 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.87H13V21.8c4.55-.93 8-4.96 8-9.8z"/>
  </svg>
</a>
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.402-.293 1.19-.334 1.358-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Popup */}
          {popup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div
                ref={popupRef}
                className="bg-white rounded-xl shadow-2xl p-6 min-w-[280px] max-w-xs text-center"
              >
                <h4 className="font-bold text-lg mb-2 text-blue-700">{popup.label}</h4>
                <p className="text-gray-700 mb-4">{popup.info}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => setPopup(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
