using Xunit;
using Moq;
using Application.Services;
using Application.Interfaces;
using Application.DTOs;
using Domain.Entities;
using FluentAssertions;
using System;
using System.Threading.Tasks;

namespace UnitTests.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _mockRepo;
        private readonly OrderService _orderService;

        public OrderServiceTests()
        {
            _mockRepo = new Mock<IOrderRepository>();
            _orderService = new OrderService(_mockRepo.Object);
        }

        [Fact]
        public async Task CreateOrder_WithValidData_ShouldCreateOrder()
        {
            // Verifica que se cree una orden correctamente con datos válidos

            // Arrange
            var createDto = new CreateOrderDTO
            {
                ProductId = 1,
                Quantity = 5
            };

            var createdOrder = new Order
            {
                Id = 1,
                ProductId = createDto.ProductId,
                Quantity = createDto.Quantity,
                Total = 500,
                Date = DateTime.UtcNow,
                Product = new Product
                {
                    Id = 1,
                    Name = "Test Product",
                    Price = 100,
                    Stock = 10
                }
            };

            _mockRepo.Setup(repo => repo.CreateOrderAsync(It.IsAny<Order>()))
                    .ReturnsAsync(createdOrder);

            // Act
            var result = await _orderService.CreateOrder(createDto);

            // Assert
            result.Should().NotBeNull();
            result.ProductId.Should().Be(createDto.ProductId);
            result.Quantity.Should().Be(createDto.Quantity);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public async Task CreateOrder_WithInvalidQuantity_ShouldThrowArgumentException(int invalidQuantity)
        {
            // Verifica que se lance una excepción cuando la cantidad es 0 o negativa

            // Arrange
            var createDto = new CreateOrderDTO
            {
                ProductId = 1,
                Quantity = invalidQuantity
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
                _orderService.CreateOrder(createDto));

            exception.Message.Should().Contain("cantidad debe ser mayor a 0");
        }

        [Fact]
        public async Task CreateOrder_WithNullDto_ShouldThrowArgumentNullException()
        {
            // Verifica que se lance una excepción cuando el DTO es nulo

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() =>
                _orderService.CreateOrder(null));
        }
    }
}