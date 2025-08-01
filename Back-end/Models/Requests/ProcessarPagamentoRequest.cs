namespace Horizon.Models.Requests
{
    public class ProcessarPagamentoRequest
    {
        public string Data { get; set; } = string.Empty;
        public int QuantidadePessoas { get; set; }
        public string? Desconto { get; set; }
        public string FormaPagamento { get; set; } = "Cartão de Crédito";
        public int PacoteId { get; set; }
        public string UsuarioId { get; set; } = string.Empty;
        public string? PaymentMethodId { get; set; }
        public decimal ValorTotal { get; set; }
        public int Duracao { get; set; }
    }
}
