using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class UsuarioRepository : IRepository<Usuario>
    {

        private readonly HorizonDbContext _context;

        public UsuarioRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task<Usuario> AddAsync(Usuario entity)
        {
            var entry = await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return false;
            }
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<Usuario> UpdateAsync(Usuario entity)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.UsuarioId == entity.UsuarioId);

            if (usuario != null)
            {
                usuario.Nome = entity.Nome;
                usuario.Email = entity.Email;
                usuario.Senha = entity.Senha;
                usuario.Telefone = entity.Telefone;           
                usuario.CpfPassaporte = entity.CpfPassaporte; 
                usuario.TipoUsuario = entity.TipoUsuario;    

                await _context.SaveChangesAsync();
            }

            return usuario;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
