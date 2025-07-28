using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class PagamentoService : IPagamento
    {
        private readonly IPagamentoRepository _pagamentoRepository;

        public PagamentoService(IPagamentoRepository pagamentoRepository)
        {
            _pagamentoRepository = pagamentoRepository;
        }

        public async Task<Pagamento> AddAsync(Pagamento entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            if (entity.ValorPagamento <= 0)
                throw new ArgumentException("Valor do pagamento deve ser maior que zero.");

            if (string.IsNullOrWhiteSpace(entity.TipoPagamento))
                throw new ArgumentException("Tipo de pagamento é obrigatório.");

            entity.DataPagamento = DateTime.Now;
            entity.StatusPagamento = "Pendente";

            return await _pagamentoRepository.AddAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var pagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (pagamento == null)
                return false;

            if (pagamento.StatusPagamento == "Aprovado")
                throw new InvalidOperationException("Não é possível excluir um pagamento aprovado.");

            return await _pagamentoRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Pagamento>> GetAllAsync()
        {
            return await _pagamentoRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Pagamento>> GetAprovadosAsync()
        {
            return await _pagamentoRepository.GetAprovadosAsync();
        }

        public async Task<Pagamento?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID deve ser maior que zero.");

            return await _pagamentoRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Pagamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            if (dataInicio > dataFim)
                throw new ArgumentException("Data de início não pode ser maior que data fim.");

            return await _pagamentoRepository.GetByPeriodoAsync(dataInicio, dataFim);
        }

        public async Task<IEnumerable<Pagamento>> GetByReservaIdAsync(int reservaId)
        {
            if (reservaId <= 0)
                throw new ArgumentException("ID da reserva deve ser maior que zero.");

            return await _pagamentoRepository.GetByReservaIdAsync(reservaId);
        }

        public async Task<IEnumerable<Pagamento>> GetByStatusAsync(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new ArgumentException("Status é obrigatório.");

            return await _pagamentoRepository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<Pagamento>> GetByTipoAsync(string tipo)
        {
            if (string.IsNullOrWhiteSpace(tipo))
                throw new ArgumentException("Tipo é obrigatório.");

            return await _pagamentoRepository.GetByTipoAsync(tipo);
        }

        public async Task<IEnumerable<Pagamento>> GetPendentesAsync()
        {
            return await _pagamentoRepository.GetPendentesAsync();
        }

        public async Task<decimal> GetValorTotalPagoAsync(int reservaId)
        {
            if (reservaId <= 0)
                throw new ArgumentException("ID da reserva deve ser maior que zero.");

            return await _pagamentoRepository.GetValorTotalPagoAsync(reservaId);
        }

        public async Task<bool> HasPagamentoAprovadoAsync(int reservaId)
        {
            if (reservaId <= 0)
                throw new ArgumentException("ID da reserva deve ser maior que zero.");

            return await _pagamentoRepository.HasPagamentoAprovadoAsync(reservaId);
        }

        public async Task SaveChangesAsync()
        {
            await _pagamentoRepository.SaveChangesAsync();
        }

        public async Task<Pagamento> UpdateAsync(Pagamento entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            if (entity.PagamentoId <= 0)
                throw new ArgumentException("ID do pagamento é obrigatório.");

            var existingPagamento = await _pagamentoRepository.GetByIdAsync(entity.PagamentoId);
            if (existingPagamento == null)
                throw new InvalidOperationException("Pagamento não encontrado.");

            if (existingPagamento.StatusPagamento == "Aprovado" && entity.StatusPagamento != "Aprovado")
                throw new InvalidOperationException("Não é possível alterar status de um pagamento aprovado.");

            if (entity.ValorPagamento <= 0)
                throw new ArgumentException("Valor do pagamento deve ser maior que zero.");

            return await _pagamentoRepository.UpdateAsync(entity);
        }

        public async Task<bool> UpdateStatusAsync(int pagamentoId, string novoStatus)
        {
            if (pagamentoId <= 0)
                throw new ArgumentException("ID do pagamento deve ser maior que zero.");

            if (string.IsNullOrWhiteSpace(novoStatus))
                throw new ArgumentException("Novo status é obrigatório.");

            var statusValidos = new[] { "Pendente", "Aprovado", "Rejeitado", "Cancelado" };
            if (!statusValidos.Contains(novoStatus))
                throw new ArgumentException("Status inválido.");

            var pagamento = await _pagamentoRepository.GetByIdAsync(pagamentoId);
            if (pagamento == null)
                return false;

            if (pagamento.StatusPagamento == "Aprovado" && novoStatus != "Aprovado")
                throw new InvalidOperationException("Não é possível alterar status de um pagamento aprovado.");

            return await _pagamentoRepository.UpdateStatusAsync(pagamentoId, novoStatus);
        }
    }
}
