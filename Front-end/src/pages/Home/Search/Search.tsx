import React, { useState } from 'react';

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
  { value: 'bahia', label: 'Bahia, Brasil', flag: '🇧🇷' },
  { value: 'paris', label: 'Paris, França', flag: '🇫🇷' },
  { value: 'cancun', label: 'Cancún, México', flag: '🇲🇽' },
  { value: 'rio', label: 'Rio de Janeiro, Brasil', flag: '🇧🇷' },
  { value: 'londres', label: 'Londres, Inglaterra', flag: '🇬🇧' },
  { value: 'tokyo', label: 'Tóquio, Japão', flag: '🇯🇵' },
  { value: 'miami', label: 'Miami, EUA', flag: '🇺🇸' },
  { value: 'barcelona', label: 'Barcelona, Espanha', flag: '🇪🇸' },
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
    const lastDay = new Date(year, month + 1, 0);
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
      // Primeira seleção ou reiniciar
      setTempCheckIn(dateStr);
      setTempCheckOut('');
    } else if (tempCheckIn && !tempCheckOut) {
      // Segunda seleção
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
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </h3>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-3">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-2">
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
                  h-12 w-12 text-sm font-medium transition-all duration-200 rounded-lg
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
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-8 mt-2 z-30 min-w-[800px]">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={goToPrevMonth}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <div className="flex gap-12">
          <span className="text-xl font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <span className="text-xl font-semibold text-gray-800">
            {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
          </span>
        </div>
        <button
          onClick={goToNextMonth}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors text-xl font-bold"
        >
          →
        </button>
      </div>

      {/* Dois meses lado a lado */}
      <div className="flex gap-12 mb-8">
        {renderMonth(currentMonth)}
        {renderMonth(nextMonth)}
      </div>

      {/* Informações da seleção */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-8 text-base">
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
          
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="px-5 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Limpar
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={!tempCheckIn || !tempCheckOut}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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

  // Função para atualizar os campos do formulário
  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para abrir/fechar calendário
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // Função para selecionar datas do calendário
  const handleDateSelection = (checkIn: string, checkOut: string) => {
    setFormData(prev => ({
      ...prev,
      checkIn,
      checkOut
    }));
  };

  // Função para selecionar destino
  const handleDestinationSelect = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      destination
    }));
    setDestinationQuery(destination);
    setIsDestinationOpen(false);
  };

  // Filtrar destinos baseado na busca
  const filteredDestinations = destinations.filter(dest =>
    dest.label.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  // Função para formatar data para exibição
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Função para incrementar/decrementar valores
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

  // Função para buscar
  const handleSearch = () => {
    console.log('Dados da busca:', formData);
    alert(`Buscando por: ${formData.destination} | Check-in: ${formData.checkIn} | Check-out: ${formData.checkOut} | ${formData.rooms} quarto(s) | ${formData.adults} adulto(s) | ${formData.children} criança(s)`);
  };

  // Fechar dropdowns quando clicar fora
  const handleClickOutside = () => {
    setIsDestinationOpen(false);
    setIsGuestsOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-10" onClick={handleClickOutside}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
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
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-left bg-white hover:bg-gray-50"
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
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-left bg-white hover:bg-gray-50"
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
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 h-14 mb-2"
              >
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
