using System.ComponentModel.DataAnnotations;

namespace Horizon.Models
{
    public class Pacote
    {
        [Key]
        public int PacoteId { get; set; }

        [Required]
        public string? Titulo { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "A descrição deve ter no máximo 50 caracteres.")]

        public string? Descricao { get; set; }

        [Required]
        public string? Destino { get; set; }

        public int Duracao { get; set; }
        public int QuantidadeDePessoas { get; set; }
        public decimal ValorTotal { get; set; }
    }
}
