using System.ComponentModel.DataAnnotations;

namespace Horizon.Models
{
    public class Quarto
    {
        [Key]
        public int QuartoId { get; set; }

        [StringLength(50, ErrorMessage = "A descrição deve ter no máximo 50 caracteres.")]

        public string? Descricao { get; set; }
        public bool AmbienteClimatizado { get; set; }
        public bool Tv { get; set; }
        public bool Varanda { get; set; }
        public bool Frigobar { get; set; }
        public bool Disponibilidade { get; set; }
        public decimal ValorDoQuarto { get; set; }
    }
}
