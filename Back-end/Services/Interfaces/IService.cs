namespace Horizon.Services.Interfaces
{
    public interface IService<T> 
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);

        Task SaveChangesAsync();
        Task<bool> DeleteAsync(int id);
    }
}
