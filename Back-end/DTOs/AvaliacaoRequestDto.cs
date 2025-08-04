using System.ComponentModel.DataAnnotations;

namespace Horizon.DTOs
{
    // DTO para criar uma nova avaliação
    public class CriarAvaliacaoDto
    {
        [Required]
        [Range(0, 5, ErrorMessage = "A nota deve estar entre 0 e 5.")]
        public decimal Nota { get; set; }

        [StringLength(50, ErrorMessage = "O comentário deve ter no máximo 50 caracteres.")]
        public string? Comentario { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        [Required]
        public int HotelId { get; set; }
    }

    // DTO para atualizar uma avaliação
    public class AtualizarAvaliacaoDto
    {
        [Required]
        public int IdAvaliacao { get; set; }

        [Required]
        [Range(0, 5, ErrorMessage = "A nota deve estar entre 0 e 5.")]
        public decimal Nota { get; set; }

        [StringLength(50, ErrorMessage = "O comentário deve ter no máximo 50 caracteres.")]
        public string? Comentario { get; set; }
    }
}
