using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Horizon.Models
{
    public class Pacote
    {
        [Key]
        public int PacoteId { get; set; }

        [Required]
        public string? Titulo { get; set; }

        [Required]
        [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
        public string? Descricao { get; set; }

        [Required]
        public string? Destino { get; set; }

        public int Duracao { get; set; }
        public int QuantidadeDePessoas { get; set; }
        public decimal ValorTotal { get; set; }

        // Chave estrangeira para Hotel
        [ForeignKey("Hotel")]
        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }
}
