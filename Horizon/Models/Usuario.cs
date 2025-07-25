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
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email inválido.")]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$", ErrorMessage = "A senha deve ter no mínimo 6 caracteres, incluindo letras e números.")]
        public string Senha { get; set; }

        [Required]
        public string Telefone { get; set; }

        [Required]
        public string CpfPassaporte { get; set; }

        [Required]
        public string TipoUsuario { get; set; }
    }
}
