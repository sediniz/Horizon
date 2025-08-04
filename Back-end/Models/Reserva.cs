using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Horizon.Models
{
    public enum StatusReserva
    {
        Pendente,
        Confirmada,
        Cancelada
    }

    public class Reserva
    {
        [Key]
        public int ReservaId { get; set; }

        [Required]
        public StatusReserva Status { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        [Required]
        public DateTime DataFim { get; set; }

        [Required]
        public DateTime DataReserva { get; set; } = DateTime.Now;

        public DateTime? DataViagem { get; set; }

        public int QuantidadePessoas { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal { get; set; }

        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        [ForeignKey("Hotel")]
        public int? HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        [ForeignKey("Pacote")]
        public int? PacoteId { get; set; }
        public Pacote? Pacote { get; set; }

        public ICollection<Pagamento>? Pagamentos { get; set; }
    }
}
