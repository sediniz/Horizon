import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import SmartSearch from '../../../components/SmartSearch';
import { getAllPacotes } from '../../../api/pacotes';
import { getHoteisByIds } from '../../../api/hoteis';
import { convertAPIPackagesToPackages } from '../../../utils/packageConverter';

// Tipos para os dados do formulário
interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

// Função para determinar a flag baseada na localização
const getFlagForLocation = (location: string): string => {
  const loc = location.toLowerCase();
  
  // Brasil e estados brasileiros
  if (loc.includes('brasil') || loc.includes('rs') || loc.includes('rj') || 
      loc.includes('bahia') || loc.includes('gramado') || loc.includes('rio de janeiro')) {
    return '🇧🇷';
  }
  
  // Outros países
  if (loc.includes('frança') || loc.includes('paris')) return '🇫🇷';
  if (loc.includes('méxico') || loc.includes('cancún')) return '🇲🇽';
  if (loc.includes('emirados') || loc.includes('dubai')) return '🇦🇪';
  if (loc.includes('japão') || loc.includes('tóquio')) return '🇯🇵';
  if (loc.includes('maldivas')) return '🇲🇻';
  
  // Para destinos não identificados, usar um ícone de localização ao invés do globo
  return '📍';
};

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
  const [destinations, setDestinations] = useState<{ value: string; label: string; flag: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar destinos dinamicamente dos pacotes
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        
        // Tentar buscar pacotes da API
        const pacotesAPI = await getAllPacotes();
        const hotelIds = [...new Set(pacotesAPI.map(p => p.hotelId))];
        const hoteis = await getHoteisByIds(hotelIds);
        
        const hotelMap = new Map(hoteis.map(hotel => [hotel.hotelId, hotel]));
        const pacotesComHotel = pacotesAPI.map(pacote => ({
          ...pacote,
          hotel: hotelMap.get(pacote.hotelId)
        }));
        
        const convertedPackages = convertAPIPackagesToPackages(pacotesComHotel);
        
        // Extrair destinos únicos
        const uniqueDestinations = [...new Set(convertedPackages.map(pkg => pkg.location))];
        
        // Converter para formato do SmartSearch
        const formattedDestinations = uniqueDestinations.map((location, index) => ({
          value: `dest-${index}`,
          label: location,
          flag: getFlagForLocation(location)
        }));
        
        setDestinations(formattedDestinations);
        
      } catch (error) {
        console.error('Erro ao carregar destinos, usando dados mockados:', error);
        
        // Fallback para dados mockados
        const { allPackages } = await import('../../PacotesGerais/data/packagesData');
        const uniqueDestinations = [...new Set(allPackages.map(pkg => pkg.location))];
        
        const formattedDestinations = uniqueDestinations.map((location, index) => ({
          value: `dest-${index}`,
          label: location,
          flag: getFlagForLocation(location)
        }));
        
        setDestinations(formattedDestinations);
        
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

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

  const handleDestinationSelect = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      destination: cityName // SmartSearch já retorna apenas o nome da cidade
    }));
  };



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
    
    // Enviar apenas o destino para filtragem, mas manter todas as informações para display
    const searchParams = new URLSearchParams({
      destino: formData.destination, // Usado para filtrar pacotes
      // Informações apenas para exibição (não para filtro)
      checkin: formData.checkIn,
      checkout: formData.checkOut,
      quartos: formData.rooms.toString(),
      adultos: formData.adults.toString(),
      criancas: formData.children.toString()
    });
    
    console.log('Navegando para PacotesGerais - Filtrando apenas por:', formData.destination);
    
    navigate(`/pacotes?${searchParams.toString()}`);
  };

  const handleClickOutside = () => {
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
            {/* Destino com SmartSearch */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destino
              </label>
              <SmartSearch
                destinations={destinations}
                onSelect={handleDestinationSelect}
                placeholder={loading ? "Carregando destinos..." : "Para onde você quer ir?"}
                value={formData.destination}
              />
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
