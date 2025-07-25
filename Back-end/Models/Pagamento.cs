using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Horizon.Models
{
    public class Pagamento
    {
        [Key]
        public int PagamentoId { get; set; }

        [Required]
        public string TipoPagamento { get; set; }

        [Required]
        public string StatusPagamento { get; set; }

        [Required]
        public decimal ValorPagamento { get; set; }

        public string? ComprovantePagamento { get; set; }
        public DateTime DataPagamento { get; set; }

        [ForeignKey("Reserva")]
        public int ReservaId { get; set; }
        public Reserva Reserva { get; set; }
    }
}
