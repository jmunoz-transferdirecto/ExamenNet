using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        private static ProductDTO MapToProductDTO(Product product)
        {
            if (product == null) return null;

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock
            };
        }

        private static OrderDTO MapToOrderDTO(Order order)
        {
            return new OrderDTO
            {
                Id = order.Id,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Total = order.Total,
                Date = order.Date,
                Product = MapToProductDTO(order.Product)
            };
        }

        public async Task<OrderDTO> CreateOrder(CreateOrderDTO createOrderDto, int maxRetries = 3)
        {
            if (createOrderDto == null)
                throw new ArgumentNullException(nameof(createOrderDto));

            if (createOrderDto.Quantity <= 0)
                throw new ArgumentException("La cantidad debe ser mayor a 0", nameof(createOrderDto.Quantity));

            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    var order = new Order
                    {
                        ProductId = createOrderDto.ProductId,
                        Quantity = createOrderDto.Quantity,
                        Date = DateTime.UtcNow
                    };

                    var createdOrder = await _orderRepository.CreateOrderAsync(order);
                    return MapToOrderDTO(createdOrder);
                }
                catch (InvalidOperationException) when (i < maxRetries - 1)
                {
                    await Task.Delay(100 * (int)Math.Pow(2, i));
                    continue;
                }
            }
            throw new InvalidOperationException("Could not process order after multiple attempts. Please try again.");
        }

        public async Task<IEnumerable<OrderDTO>> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToOrderDTO);
        }
    }
}