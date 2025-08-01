namespace Horizon.Models.Requests
{
    public class PaymentIntentRequest
    {
        public decimal ValorTotal { get; set; }
        public int ReservaId { get; set; }
        public string? TipoPagamento { get; set; }
    }
}
