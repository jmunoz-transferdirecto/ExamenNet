using System.Data;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead);
            try
            {                
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == order.ProductId);

                if (product == null)
                    throw new KeyNotFoundException("Product not found");

                if (product.Stock < order.Quantity)
                    throw new InvalidOperationException("Insufficient stock");

                product.Stock -= order.Quantity;
                order.Total = product.Price * order.Quantity;
                order.Date = DateTime.UtcNow;

                _context.Orders.Add(order);

                try 
                {
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    await _context.Entry(order)
                        .Reference(o => o.Product)
                        .LoadAsync();

                    return order;
                }
                catch (DbUpdateConcurrencyException)
                {
                    await transaction.RollbackAsync();
                    throw new InvalidOperationException("El producto fue modificado por otro usuario. Por favor, inténtelo nuevamente.");
                }
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Product)
                .OrderByDescending(o => o.Date)
                .ToListAsync();
        }
    }
}