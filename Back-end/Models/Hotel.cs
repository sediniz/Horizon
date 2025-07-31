using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Horizon.Models
{
    public class Hotel
    {
        [Key]
        public int HotelId { get; set; }

        [Required]
        public int QuantidadeDeQuartos { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "O nome deve ter no máximo 30 caracteres.")]

        public string? Nome { get; set; }

        [Required]
        public string? Localizacao { get; set; }

        [StringLength(100, ErrorMessage = "A descrição deve ter no máximo 100 caracteres.")]

        public string? Descricao { get; set; }
        public bool Estacionamento { get; set; }
        public bool PetFriendly { get; set; }
        public bool Piscina { get; set; }
        public bool Wifi { get; set; }

        public bool CafeDaManha { get; set; }
        public bool Almoco { get; set; }
        public bool Jantar { get; set; }
        public bool AllInclusive { get; set; }

        public DateTime DatasDisponiveis { get; set; }
        public decimal ValorDiaria { get; set; }
        public string? Imagens { get; set; }

        public ICollection<Avaliacao>? Avaliacoes { get; set; }

        [ForeignKey("Quarto")]
        public int? QuartoId { get; set; }
        public Quarto? Quarto { get; set; }
        
    }
}