namespace Horizon.Models.Requests
{
    public class ConfirmarPagamentoRequest
    {
        public string PaymentIntentId { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public int? PacoteId { get; set; }
        public DateTime DataViagem { get; set; }
        public int QuantidadePessoas { get; set; }
    }
}
