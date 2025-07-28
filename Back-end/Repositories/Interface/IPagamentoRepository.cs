using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IPagamentoRepository : IRepository<Pagamento>
    {

        // Buscar pagamentos por reserva específica
        Task<IEnumerable<Pagamento>> GetByReservaIdAsync(int reservaId);

        // Buscar pagamentos por status
        Task<IEnumerable<Pagamento>> GetByStatusAsync(string status);

        // Buscar pagamentos por tipo
        Task<IEnumerable<Pagamento>> GetByTipoAsync(string tipo);

        // Buscar pagamentos por período
        Task<IEnumerable<Pagamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim);

        // Buscar pagamentos pendentes
        Task<IEnumerable<Pagamento>> GetPendentesAsync();

        // Buscar pagamentos aprovados
        Task<IEnumerable<Pagamento>> GetAprovadosAsync();

        // Atualizar status do pagamento
        Task<bool> UpdateStatusAsync(int pagamentoId, string novoStatus);

        // Verificar se reserva tem pagamento aprovado
        Task<bool> HasPagamentoAprovadoAsync(int reservaId);

        // Obter valor total pago para uma reserva
        Task<decimal> GetValorTotalPagoAsync(int reservaId);

    }
}
