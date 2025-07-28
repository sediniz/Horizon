using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class HotelService : IHotelService
    {
        private readonly IHotelRepository _hotelRepository;

        public HotelService(IHotelRepository hotelRepository)
        {
            _hotelRepository = hotelRepository;
        }

        public async Task<IEnumerable<Hotel>> GetAllAsync() =>
            await _hotelRepository.GetAllAsync();

        public async Task<Hotel?> GetByIdAsync(int id) =>
            await _hotelRepository.GetByIdAsync(id);

        public async Task<Hotel> AddAsync(Hotel entity)
        {
            if (string.IsNullOrWhiteSpace(entity.Nome) || entity.Nome.Length > 30)
                throw new ArgumentException("O nome do hotel é obrigatório e deve ter no máximo 30 caracteres.");

            if (await _hotelRepository.NameExistsAsync(entity.Nome!))
                throw new InvalidOperationException("Já existe um hotel com esse nome.");

            if (!string.IsNullOrWhiteSpace(entity.Descricao) && entity.Descricao.Length > 100)
                throw new ArgumentException("A descrição deve ter no máximo 100 caracteres.");

            if (entity.ValorDiaria < 0)
                throw new ArgumentException("O valor da diária não pode ser negativo.");

            return await _hotelRepository.AddAsync(entity);
        }

        public async Task<Hotel> UpdateAsync(Hotel entity)
        {
            var existente = await _hotelRepository.GetByIdAsync(entity.HotelId);
            if (existente == null)
                throw new KeyNotFoundException("Hotel não encontrado.");

            if (string.IsNullOrWhiteSpace(entity.Nome) || entity.Nome.Length > 30)
                throw new ArgumentException("O nome do hotel é obrigatório e deve ter no máximo 30 caracteres.");

            if (!string.IsNullOrWhiteSpace(entity.Descricao) && entity.Descricao.Length > 100)
                throw new ArgumentException("A descrição deve ter no máximo 100 caracteres.");

            if (entity.ValorDiaria < 0)
                throw new ArgumentException("O valor da diária não pode ser negativo.");

            // Não permitir duplicidade de nome (exceto para o próprio hotel)
            if (entity.Nome != existente.Nome && await _hotelRepository.NameExistsAsync(entity.Nome!))
                throw new InvalidOperationException("Já existe um hotel com esse nome.");

            return await _hotelRepository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existente = await _hotelRepository.GetByIdAsync(id);
            if (existente == null)
                throw new KeyNotFoundException("Hotel não encontrado.");
            return await _hotelRepository.DeleteAsync(id);
        }

        public async Task SaveChangesAsync() =>
            await _hotelRepository.SaveChangesAsync();

        public async Task<Hotel?> GetByNameAsync(string nome) =>
            await _hotelRepository.GetByNameAsync(nome);

        public async Task<bool> NameExistsAsync(string nome) =>
            await _hotelRepository.NameExistsAsync(nome);

        public async Task<IEnumerable<Hotel>> GetHotelsByLocalizacaoAsync(string localizacao) =>
            await _hotelRepository.GetHotelsByLocalizacaoAsync(localizacao);

        public async Task<IEnumerable<Hotel>> GetHotelsDisponiveisAsync(DateTime dataInicio, DateTime dataFim)
        {
            if (dataInicio > dataFim)
                throw new ArgumentException("A data de início não pode ser maior que a data de fim.");
            return await _hotelRepository.GetHotelsDisponiveisAsync(dataInicio, dataFim);
        }

        public async Task<IEnumerable<Hotel>> GetHotelsComCaracteristicasAsync(bool estacionamento, bool petFriendly, bool piscina, bool wifi) =>
            await _hotelRepository.GetHotelsComCaracteristicasAsync(estacionamento, petFriendly, piscina, wifi);

    }
}
