using System.ComponentModel.DataAnnotations;

namespace Horizon.Models
{
    public class Usuario
    {
        [Key]
        public int UsuarioId { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "O nome deve ter no máximo 20 caracteres.")]

        public string Nome { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Senha { get; set; }

        [Required]
        public string Telefone { get; set; }

        [Required]
        public string CpfPassaporte { get; set; }

        [Required]
        public string TipoUsuario { get; set; }
    }
}
