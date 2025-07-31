using System.ComponentModel.DataAnnotations;

namespace Horizon.Models
{
    public class Avaliacao
    {

        [Key]
        public int IdAvaliacao { get; set; }

        public decimal Nota { get; set; }

        [StringLength(50, ErrorMessage = "O comentário deve ter no máximo 50 caracteres.")]
        public string? Comentario { get; set; }

        public DateTime DataAvaliacao { get; set; }

        public int IdUsuario { get; set; }

        public int hotelId { get; set; }

    }
}
