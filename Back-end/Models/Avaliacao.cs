using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        // Chave estrangeira para Usuario
        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public virtual Usuario? Usuario { get; set; }

        // Chave estrangeira para Hotel
        [ForeignKey("Hotel")]
        public int hotelId { get; set; }
        public virtual Hotel? Hotel { get; set; }

    }
}
