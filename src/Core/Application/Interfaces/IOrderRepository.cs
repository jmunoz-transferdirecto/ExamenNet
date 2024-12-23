using Domain.Entities;

namespace Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetAllAsync();
    }
}