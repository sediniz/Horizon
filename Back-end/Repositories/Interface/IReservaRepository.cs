﻿using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IReservaRepository : IService<Reserva>
    {
        Task<IEnumerable<Reserva>> GetReservasByClienteIdAsync(int clienteId);
        Task<IEnumerable<Reserva>> GetReservasByHotelIdAsync(int hotelId);
        Task<IEnumerable<Reserva>> GetReservasByDataAsync(DateTime data);
        Task<IEnumerable<Reserva>> GetReservasByClienteIdAndPeriodoAsync(int clienteId, DateTime dataInicio, DateTime dataFim);



        Task<bool> AlterarStatusReservaAsync(int reservaId, StatusReserva novoStatus);
    }
}
