namespace Horizon.Models
{
    public class Pagamento
    {
        public int IdPagamento { get; set; }

        public required string TipoPagamento { get; set; } // "Cartão de Crédito", "Boleto", "Pix", etc.

        public required string StatusPagamento { get; set; } // "Pendente", "Aprovado", "Recusado", etc.

        public required decimal ValorPagamento { get; set; } // Valor do pagamento

        public string? ComprovantePagamento { get; set; } // URL ou caminho do comprovante de pagamento, se aplicável

        public DateTime DataPagamento { get; set; } // Data e hora do pagamento

        public int ReservaId { get; set; } // Chave estrangeira para a tabela de reservas
    }
}
