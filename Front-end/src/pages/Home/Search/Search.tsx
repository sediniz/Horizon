import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

// Tipos para os dados do formulário
interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

// Lista de destinos disponíveis
const destinations = [
  { value: 'sao-paulo', label: 'São Paulo, SP', flag: '🇧🇷' },
  { value: 'rio-de-janeiro', label: 'Rio de Janeiro, RJ', flag: '🇧🇷' },
  { value: 'salvador', label: 'Salvador, BA', flag: '🇧🇷' },
  { value: 'brasilia', label: 'Brasília, DF', flag: '🇧🇷' },
  { value: 'fortaleza', label: 'Fortaleza, CE', flag: '🇧🇷' },
  { value: 'belo-horizonte', label: 'Belo Horizonte, MG', flag: '🇧🇷' },
  { value: 'manaus', label: 'Manaus, AM', flag: '🇧🇷' },
  { value: 'curitiba', label: 'Curitiba, PR', flag: '🇧🇷' },
  { value: 'recife', label: 'Recife, PE', flag: '🇧🇷' },
  { value: 'porto-alegre', label: 'Porto Alegre, RS', flag: '🇧🇷' },
  { value: 'goiania', label: 'Goiânia, GO', flag: '🇧🇷' },
  { value: 'belem', label: 'Belém, PA', flag: '🇧🇷' },
  { value: 'guarulhos', label: 'Guarulhos, SP', flag: '🇧🇷' },
  { value: 'campinas', label: 'Campinas, SP', flag: '🇧🇷' },
  { value: 'sao-luis', label: 'São Luís, MA', flag: '🇧🇷' },
  { value: 'sao-goncalo', label: 'São Gonçalo, RJ', flag: '🇧🇷' },
  { value: 'maceio', label: 'Maceió, AL', flag: '🇧🇷' },
  { value: 'duque-de-caxias', label: 'Duque de Caxias, RJ', flag: '🇧🇷' },
  { value: 'teresina', label: 'Teresina, PI', flag: '🇧🇷' },
  { value: 'natal', label: 'Natal, RN', flag: '🇧🇷' },
  { value: 'nova-iguacu', label: 'Nova Iguaçu, RJ', flag: '🇧🇷' },
  { value: 'campo-grande', label: 'Campo Grande, MS', flag: '🇧🇷' },
  { value: 'sao-bernardo', label: 'São Bernardo do Campo, SP', flag: '🇧🇷' },
  { value: 'joao-pessoa', label: 'João Pessoa, PB', flag: '🇧🇷' },
  { value: 'santo-andre', label: 'Santo André, SP', flag: '🇧🇷' },
  { value: 'osasco', label: 'Osasco, SP', flag: '🇧🇷' },
  { value: 'jaboatao', label: 'Jaboatão dos Guararapes, PE', flag: '🇧🇷' },
  { value: 'sao-jose-dos-campos', label: 'São José dos Campos, SP', flag: '🇧🇷' },
  { value: 'ribeirao-preto', label: 'Ribeirão Preto, SP', flag: '🇧🇷' },
  { value: 'uberlandia', label: 'Uberlândia, MG', flag: '🇧🇷' },
  { value: 'sorocaba', label: 'Sorocaba, SP', flag: '🇧🇷' },
  { value: 'contagem', label: 'Contagem, MG', flag: '🇧🇷' },
  { value: 'aracaju', label: 'Aracaju, SE', flag: '🇧🇷' },
  { value: 'feira-de-santana', label: 'Feira de Santana, BA', flag: '🇧🇷' },
  { value: 'cuiaba', label: 'Cuiabá, MT', flag: '🇧🇷' },
  { value: 'joinville', label: 'Joinville, SC', flag: '🇧🇷' },
  { value: 'juiz-de-fora', label: 'Juiz de Fora, MG', flag: '🇧🇷' },
  { value: 'londrina', label: 'Londrina, PR', flag: '�🇷' },
  { value: 'aparecida-de-goiania', label: 'Aparecida de Goiânia, GO', flag: '🇧🇷' },
  { value: 'porto-velho', label: 'Porto Velho, RO', flag: '🇧🇷' },
  { value: 'serra', label: 'Serra, ES', flag: '🇧🇷' },
  { value: 'niteroi', label: 'Niterói, RJ', flag: '🇧🇷' },
  { value: 'caxias-do-sul', label: 'Caxias do Sul, RS', flag: '🇧🇷' },
  { value: 'campos-dos-goytacazes', label: 'Campos dos Goytacazes, RJ', flag: '🇧🇷' },
  { value: 'vila-velha', label: 'Vila Velha, ES', flag: '🇧🇷' },
  { value: 'macapa', label: 'Macapá, AP', flag: '🇧🇷' },
  { value: 'florianopolis', label: 'Florianópolis, SC', flag: '🇧🇷' },
  { value: 'vitoria', label: 'Vitória, ES', flag: '🇧🇷' },
  { value: 'boa-vista', label: 'Boa Vista, RR', flag: '🇧🇷' },
  { value: 'rio-branco', label: 'Rio Branco, AC', flag: '🇧🇷' },
  { value: 'palmas', label: 'Palmas, TO', flag: '🇧🇷' },
  
  // Destinos turísticos brasileiros populares
  { value: 'gramado', label: 'Gramado, RS', flag: '🇧🇷' },
  { value: 'buzios', label: 'Búzios, RJ', flag: '🇧🇷' },
  { value: 'angra-dos-reis', label: 'Angra dos Reis, RJ', flag: '🇧🇷' },
  { value: 'porto-de-galinhas', label: 'Porto de Galinhas, PE', flag: '🇧🇷' },
  { value: 'fernando-de-noronha', label: 'Fernando de Noronha, PE', flag: '🇧🇷' },
  { value: 'chapada-diamantina', label: 'Chapada Diamantina, BA', flag: '🇧🇷' },
  { value: 'pantanal', label: 'Pantanal, MT', flag: '🇧🇷' },
  { value: 'bonito', label: 'Bonito, MS', flag: '🇧🇷' },
  { value: 'jericoacoara', label: 'Jericoacoara, CE', flag: '🇧🇷' },
  { value: 'canoa-quebrada', label: 'Canoa Quebrada, CE', flag: '🇧�' },
  { value: 'paraty', label: 'Paraty, RJ', flag: '�🇷' },
  { value: 'ilha-grande', label: 'Ilha Grande, RJ', flag: '🇧🇷' },
  { value: 'arraial-do-cabo', label: 'Arraial do Cabo, RJ', flag: '🇧🇷' },
  { value: 'caldas-novas', label: 'Caldas Novas, GO', flag: '🇧🇷' },
  { value: 'ouro-preto', label: 'Ouro Preto, MG', flag: '🇧🇷' },
  { value: 'tiradentes', label: 'Tiradentes, MG', flag: '🇧🇷' },
  { value: 'canela', label: 'Canela, RS', flag: '🇧🇷' },
  { value: 'campos-do-jordao', label: 'Campos do Jordão, SP', flag: '🇧🇷' },
  { value: 'ubatuba', label: 'Ubatuba, SP', flag: '🇧🇷' },
  { value: 'ilhabela', label: 'Ilhabela, SP', flag: '🇧🇷' },
  { value: 'guaruja', label: 'Guarujá, SP', flag: '🇧🇷' },
  { value: 'santos', label: 'Santos, SP', flag: '🇧🇷' },
  { value: 'cabo-frio', label: 'Cabo Frio, RJ', flag: '🇧🇷' },
  { value: 'petropolis', label: 'Petrópolis, RJ', flag: '🇧🇷' },
  { value: 'itacare', label: 'Itacaré, BA', flag: '🇧🇷' },
  { value: 'morro-de-sao-paulo', label: 'Morro de São Paulo, BA', flag: '🇧🇷' },
  { value: 'trancoso', label: 'Trancoso, BA', flag: '🇧🇷' },
  { value: 'caraiva', label: 'Caraíva, BA', flag: '🇧🇷' },
  { value: 'lencois-maranhenses', label: 'Lençóis Maranhenses, MA', flag: '🇧🇷' },
  { value: 'alter-do-chao', label: 'Alter do Chão, PA', flag: '🇧🇷' },
  { value: 'monte-roraima', label: 'Monte Roraima, RR', flag: '🇧🇷' },
  { value: 'chapada-dos-veadeiros', label: 'Chapada dos Veadeiros, GO', flag: '🇧🇷' },
  { value: 'jalapao', label: 'Jalapão, TO', flag: '🇧🇷' },
  
  // Destinos internacionais
  { value: 'paris', label: 'Paris, França', flag: '🇫🇷' },
  { value: 'londres', label: 'Londres, Inglaterra', flag: '🇬🇧' },
  { value: 'nova-york', label: 'Nova York, EUA', flag: '🇺🇸' },
  { value: 'miami', label: 'Miami, EUA', flag: '🇺🇸' },
  { value: 'los-angeles', label: 'Los Angeles, EUA', flag: '🇺🇸' },
  { value: 'las-vegas', label: 'Las Vegas, EUA', flag: '🇺🇸' },
  { value: 'orlando', label: 'Orlando, EUA', flag: '🇺🇸' },
  { value: 'madrid', label: 'Madrid, Espanha', flag: '🇪🇸' },
  { value: 'barcelona', label: 'Barcelona, Espanha', flag: '🇪🇸' },
  { value: 'roma', label: 'Roma, Itália', flag: '🇮🇹' },
  { value: 'milao', label: 'Milão, Itália', flag: '🇮🇹' },
  { value: 'veneza', label: 'Veneza, Itália', flag: '🇮🇹' },
  { value: 'amsterdam', label: 'Amsterdam, Holanda', flag: '🇳🇱' },
  { value: 'berlim', label: 'Berlim, Alemanha', flag: '🇩🇪' },
  { value: 'munique', label: 'Munique, Alemanha', flag: '🇩🇪' },
  { value: 'zurique', label: 'Zurique, Suíça', flag: '🇨🇭' },
  { value: 'viena', label: 'Viena, Áustria', flag: '🇦🇹' },
  { value: 'praga', label: 'Praga, República Tcheca', flag: '🇨🇿' },
  { value: 'budapeste', label: 'Budapeste, Hungria', flag: '🇭🇺' },
  { value: 'varsovia', label: 'Varsóvia, Polônia', flag: '🇵🇱' },
  { value: 'estocolmo', label: 'Estocolmo, Suécia', flag: '🇸🇪' },
  { value: 'oslo', label: 'Oslo, Noruega', flag: '🇳🇴' },
  { value: 'copenhague', label: 'Copenhague, Dinamarca', flag: '🇩🇰' },
  { value: 'helsinque', label: 'Helsinque, Finlândia', flag: '🇫🇮' },
  { value: 'reykjavik', label: 'Reykjavik, Islândia', flag: '🇮🇸' },
  { value: 'dublin', label: 'Dublin, Irlanda', flag: '🇮🇪' },
  { value: 'lisboa', label: 'Lisboa, Portugal', flag: '🇵🇹' },
  { value: 'porto', label: 'Porto, Portugal', flag: '🇵🇹' },
  { value: 'tokyo', label: 'Tóquio, Japão', flag: '🇯🇵' },
  { value: 'osaka', label: 'Osaka, Japão', flag: '🇯🇵' },
  { value: 'kyoto', label: 'Kyoto, Japão', flag: '🇯🇵' },
  { value: 'seul', label: 'Seul, Coreia do Sul', flag: '🇰🇷' },
  { value: 'pequim', label: 'Pequim, China', flag: '🇨🇳' },
  { value: 'xangai', label: 'Xangai, China', flag: '🇨🇳' },
  { value: 'hong-kong', label: 'Hong Kong', flag: '🇭🇰' },
  { value: 'singapura', label: 'Singapura', flag: '🇸🇬' },
  { value: 'bangkok', label: 'Bangkok, Tailândia', flag: '🇹🇭' },
  { value: 'phuket', label: 'Phuket, Tailândia', flag: '🇹🇭' },
  { value: 'bali', label: 'Bali, Indonésia', flag: '🇮🇩' },
  { value: 'kuala-lumpur', label: 'Kuala Lumpur, Malásia', flag: '🇲🇾' },
  { value: 'mumbai', label: 'Mumbai, Índia', flag: '🇮🇳' },
  { value: 'nova-delhi', label: 'Nova Delhi, Índia', flag: '🇮🇳' },
  { value: 'dubai', label: 'Dubai, Emirados Árabes', flag: '🇦🇪' },
  { value: 'abu-dhabi', label: 'Abu Dhabi, Emirados Árabes', flag: '🇦🇪' },
  { value: 'doha', label: 'Doha, Catar', flag: '🇶🇦' },
  { value: 'istambul', label: 'Istambul, Turquia', flag: '🇹🇷' },
  { value: 'moscow', label: 'Moscou, Rússia', flag: '🇷🇺' },
  { value: 'sao-petersburgo', label: 'São Petersburgo, Rússia', flag: '🇷🇺' },
  { value: 'cairo', label: 'Cairo, Egito', flag: '🇪🇬' },
  { value: 'marrakech', label: 'Marrakech, Marrocos', flag: '🇲🇦' },
  { value: 'casablanca', label: 'Casablanca, Marrocos', flag: '🇲🇦' },
  { value: 'cape-town', label: 'Cidade do Cabo, África do Sul', flag: '🇿🇦' },
  { value: 'joanesburgo', label: 'Joanesburgo, África do Sul', flag: '🇿🇦' },
  { value: 'sydney', label: 'Sydney, Austrália', flag: '🇦🇺' },
  { value: 'melbourne', label: 'Melbourne, Austrália', flag: '🇦🇺' },
  { value: 'auckland', label: 'Auckland, Nova Zelândia', flag: '🇳🇿' },
  { value: 'wellington', label: 'Wellington, Nova Zelândia', flag: '🇳🇿' },
  { value: 'cancun', label: 'Cancún, México', flag: '🇲🇽' },
  { value: 'playa-del-carmen', label: 'Playa del Carmen, México', flag: '🇲🇽' },
  { value: 'cidade-do-mexico', label: 'Cidade do México, México', flag: '🇲�' },
  { value: 'guadalajara', label: 'Guadalajara, México', flag: '🇲🇽' },
  { value: 'buenos-aires', label: 'Buenos Aires, Argentina', flag: '🇦🇷' },
  { value: 'cordoba', label: 'Córdoba, Argentina', flag: '🇦🇷' },
  { value: 'mendoza', label: 'Mendoza, Argentina', flag: '🇦🇷' },
  { value: 'bariloche', label: 'Bariloche, Argentina', flag: '🇦🇷' },
  { value: 'santiago', label: 'Santiago, Chile', flag: '🇨🇱' },
  { value: 'valparaiso', label: 'Valparaíso, Chile', flag: '🇨🇱' },
  { value: 'lima', label: 'Lima, Peru', flag: '🇵🇪' },
  { value: 'cusco', label: 'Cusco, Peru', flag: '🇵🇪' },
  { value: 'arequipa', label: 'Arequipa, Peru', flag: '🇵🇪' },
  { value: 'bogota', label: 'Bogotá, Colômbia', flag: '🇨🇴' },
  { value: 'medellin', label: 'Medellín, Colômbia', flag: '🇨🇴' },
  { value: 'cartagena', label: 'Cartagena, Colômbia', flag: '🇨🇴' },
  { value: 'quito', label: 'Quito, Equador', flag: '🇪🇨' },
  { value: 'guayaquil', label: 'Guayaquil, Equador', flag: '🇪🇨' },
  { value: 'caracas', label: 'Caracas, Venezuela', flag: '🇻🇪' },
  { value: 'la-paz', label: 'La Paz, Bolívia', flag: '🇧🇴' },
  { value: 'santa-cruz', label: 'Santa Cruz, Bolívia', flag: '🇧🇴' },
  { value: 'asuncion', label: 'Assunção, Paraguai', flag: '🇵🇾' },
  { value: 'montevideo', label: 'Montevidéu, Uruguai', flag: '🇺🇾' },
  { value: 'punta-del-este', label: 'Punta del Este, Uruguai', flag: '��' },
];

// Componente do Calendário Inline (estilo Decolar)
const InlineCalendar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (checkIn: string, checkOut: string) => void;
  checkIn: string;
  checkOut: string;
}> = ({ isOpen, onClose, onDateSelect, checkIn, checkOut }) => {
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const today = new Date();
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Gerar dias do mês
  const generateMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: Date, monthDate: Date) => {
    return date.getMonth() === monthDate.getMonth();
  };

  const isPastDate = (date: Date) => {
    return date < today;
  };

  const isSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return dateStr === tempCheckIn || dateStr === tempCheckOut;
  };

  const isInRange = (date: Date) => {
    if (!tempCheckIn || !tempCheckOut) return false;
    const dateStr = formatDate(date);
    return dateStr > tempCheckIn && dateStr < tempCheckOut;
  };

  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;
    
    const dateStr = formatDate(date);
    
    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      setTempCheckIn(dateStr);
      setTempCheckOut('');
    } else if (tempCheckIn && !tempCheckOut) {
      if (dateStr > tempCheckIn) {
        setTempCheckOut(dateStr);
      } else {
        setTempCheckIn(dateStr);
        setTempCheckOut('');
      }
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleApply = () => {
    if (tempCheckIn && tempCheckOut) {
      onDateSelect(tempCheckIn, tempCheckOut);
      onClose();
    }
  };

  const handleClear = () => {
    setTempCheckIn('');
    setTempCheckOut('');
  };

  const getDaysBetween = () => {
    if (!tempCheckIn || !tempCheckOut) return 0;
    const start = new Date(tempCheckIn);
    const end = new Date(tempCheckOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderMonth = (monthDate: Date) => {
    const days = generateMonthDays(monthDate);
    
    return (
      <div className="flex-1">
        <div className="text-center mb-3">
          <h3 className="text-base font-semibold text-gray-800">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </h3>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dateStr = formatDate(date);
            const isCurrentMonthDay = isCurrentMonth(date, monthDate);
            const isPast = isPastDate(date);
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const todayDate = isToday(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isPast}
                className={`
                  h-7 w-7 text-xs font-medium transition-all duration-200 rounded-lg
                  ${!isCurrentMonthDay ? 'text-gray-300' : 'text-gray-700'}
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
                  ${selected && dateStr === tempCheckIn ? 'bg-purple-600 text-white' : ''}
                  ${selected && dateStr === tempCheckOut ? 'bg-purple-600 text-white' : ''}
                  ${inRange ? 'bg-purple-100 text-purple-800' : ''}
                  ${todayDate && !selected ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 mt-2 z-30 min-w-[485px]">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-base font-bold"
        >
          ←
        </button>
        <div className="flex gap-4">
          <span className="text-base font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <span className="text-base font-semibold text-gray-800">
            {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
          </span>
        </div>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-base font-bold"
        >
          →
        </button>
      </div>

      {/* Dois meses lado a lado */}
      <div className="flex gap-3 mb-4">
        {renderMonth(currentMonth)}
        {renderMonth(nextMonth)}
      </div>

      {/* Informações da seleção */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-600">Check-in: </span>
              <span className="font-semibold text-purple-600">
                {tempCheckIn ? new Date(tempCheckIn + 'T00:00:00').toLocaleDateString('pt-BR') : 'Selecione'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Check-out: </span>
              <span className="font-semibold text-purple-600">
                {tempCheckOut ? new Date(tempCheckOut + 'T00:00:00').toLocaleDateString('pt-BR') : 'Selecione'}
              </span>
            </div>
            {tempCheckIn && tempCheckOut && (
              <div>
                <span className="text-gray-600">Estadia: </span>
                <span className="font-semibold text-purple-600">
                  {getDaysBetween()} noite{getDaysBetween() !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm"
            >
              Limpar
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={!tempCheckIn || !tempCheckOut}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SearchFormData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    adults: 2,
    children: 0,
  });

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState('');

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelection = (checkIn: string, checkOut: string) => {
    setFormData(prev => ({
      ...prev,
      checkIn,
      checkOut
    }));
  };

  const handleDestinationSelect = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      destination
    }));
    setDestinationQuery(destination);
    setIsDestinationOpen(false);
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.label.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const updateCounter = (field: 'rooms' | 'adults' | 'children', operation: 'increment' | 'decrement') => {
    setFormData(prev => {
      const currentValue = prev[field];
      let newValue = currentValue;

      if (operation === 'increment') {
        newValue = currentValue + 1;
      } else if (operation === 'decrement' && currentValue > 0) {
        newValue = currentValue - 1;
        // Mínimos
        if (field === 'rooms' && newValue < 1) newValue = 1;
        if (field === 'adults' && newValue < 1) newValue = 1;
      }

      return { ...prev, [field]: newValue };
    });
  };

  const handleSearch = () => {
    if (!formData.destination) {
      alert('Por favor, selecione um destino');
      return;
    }
    
    if (!formData.checkIn || !formData.checkOut) {
      alert('Por favor, selecione as datas de check-in e check-out');
      return;
    }
    
    const searchParams = new URLSearchParams({
      destino: formData.destination,
      checkin: formData.checkIn,
      checkout: formData.checkOut,
      quartos: formData.rooms.toString(),
      adultos: formData.adults.toString(),
      criancas: formData.children.toString()
    });
    
    console.log('Navegando para PacotesGerais com parâmetros:', searchParams.toString());
    
    navigate(`/pacotes?${searchParams.toString()}`);
  };

  const handleClickOutside = () => {
    setIsDestinationOpen(false);
    setIsGuestsOpen(false);
  };

   {/* CONFIGURAÇÕES DA Borda */}
  return (
    <div className="w-full max-w-full mx-0 px-0 relative z-10" onClick={handleClickOutside}>
      <div className="bg-white rounded-b-2xl shadow-2xl p-8 border-b border-x border-gray-100">
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Encontre sua próxima aventura
          </h2>
          <p className="text-gray-600">
            Pesquise e compare os melhores destinos para sua viagem
          </p>
        </div>

        {/* Formulário de busca */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Destino */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Destino
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Para onde você quer ir?"
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value);
                    setIsDestinationOpen(true);
                  }}
                  onFocus={() => setIsDestinationOpen(true)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                
                {/* Dropdown de sugestões */}
                {isDestinationOpen && destinationQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-lg mt-1 z-20 max-h-60 overflow-y-auto">
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((dest) => (
                        <button
                          key={dest.value}
                          onClick={() => handleDestinationSelect(dest.label)}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                        >
                          <span className="text-xl">{dest.flag}</span>
                          <span className="text-gray-700">{dest.label}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        Nenhum destino encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Datas - Check-in e Check-out */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Datas
              </label>
              <button
                onClick={toggleCalendar}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-left bg-white hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Check-in</div>
                      <div className={formData.checkIn ? 'text-gray-900 font-medium text-sm' : 'text-gray-400 text-sm'}>
                        {formData.checkIn ? formatDateDisplay(formData.checkIn) : 'Ida'}
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">→</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Check-out</div>
                      <div className={formData.checkOut ? 'text-gray-900 font-medium text-sm' : 'text-gray-400 text-sm'}>
                        {formData.checkOut ? formatDateDisplay(formData.checkOut) : 'Volta'}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400"></span>
                </div>
              </button>

              {/* Calendário Inline */}
              <InlineCalendar
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onDateSelect={handleDateSelection}
                checkIn={formData.checkIn}
                checkOut={formData.checkOut}
              />
            </div>

            {/* Hóspedes e Quartos */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hóspedes & Quartos
              </label>
              <button
                onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-left bg-white hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Quartos</div>
                      <div className="text-gray-900 font-medium">{formData.rooms}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Hóspedes</div>
                      <div className="text-gray-900 font-medium">{formData.adults + formData.children}</div>
                    </div>
                  </div>
                  <span className={`transform transition-transform ${isGuestsOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Dropdown de hóspedes */}
              {isGuestsOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-lg p-4 mt-1 z-20">
                  {/* Quartos */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="font-medium text-gray-700">Quartos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCounter('rooms', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={formData.rooms <= 1}
                      >
                        -
                      </button>
                      <span className="font-medium min-w-[20px] text-center">{formData.rooms}</span>
                      <button
                        onClick={() => updateCounter('rooms', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Adultos */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="font-medium text-gray-700">Adultos</span>
                      <p className="text-xs text-gray-500">13 anos ou mais</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCounter('adults', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={formData.adults <= 1}
                      >
                        -
                      </button>
                      <span className="font-medium min-w-[20px] text-center">{formData.adults}</span>
                      <button
                        onClick={() => updateCounter('adults', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Crianças */}
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="font-medium text-gray-700">Crianças</span>
                      <p className="text-xs text-gray-500">0-12 anos</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCounter('children', 'decrement')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={formData.children <= 0}
                      >
                        -
                      </button>
                      <span className="font-medium min-w-[20px] text-center">{formData.children}</span>
                      <button
                        onClick={() => updateCounter('children', 'increment')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botão de Busca */}
            <div className="flex items-end">
              
<button
  onClick={handleSearch}
  disabled={!formData.destination || !formData.checkIn || !formData.checkOut}
  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 mb-2 flex items-center justify-center gap-2"
>
  <FaSearch className="w-5 h-5" />
  Buscar
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
