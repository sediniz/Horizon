using Horizon.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Horizon.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }

        public DbSet<TipoUsuario> TipoUsuarios { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Pacote> Pacotes { get; set; }
    }
}