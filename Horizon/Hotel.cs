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
        public string Nome { get; set; }

        [Required]
        public string Localizacao { get; set; }

        public string Descricao { get; set; }
        public bool Estacionamento { get; set; }
        public bool PetFriendly { get; set; }
        public bool Piscina { get; set; }
        public bool Wifi { get; set; }
        public DateTime DatasDisponiveis { get; set; }
        public decimal ValorDiaria { get; set; }
        public string Imagens { get; set; }

        [ForeignKey("TipoDeQuarto")]
        public int IdTiposDeQuarto { get; set; }
        public Quarto TipoDeQuarto { get; set; }
    }
}