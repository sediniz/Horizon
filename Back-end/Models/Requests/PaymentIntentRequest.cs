namespace Horizon.Models.Requests
{
    public class PaymentIntentRequest
    {
        public decimal ValorTotal { get; set; }
        public int? ReservaId { get; set; } // Tornar opcional
        public int? PacoteId { get; set; } // Adicionar pacoteId
        public string? TipoPagamento { get; set; }
    }
}
