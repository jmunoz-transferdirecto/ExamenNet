using Xunit;
using Moq;
using Application.Services;
using Application.Interfaces;
using Application.DTOs;
using Domain.Entities;
using FluentAssertions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace UnitTests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _mockRepo = new Mock<IProductRepository>();
            _productService = new ProductService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllProducts_ShouldReturnAllProducts()
        {
            // Verifica que se retornen correctamente todos los productos

            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Test1", Description = "Desc1", Price = 100, Stock = 10 },
                new Product { Id = 2, Name = "Test2", Description = "Desc2", Price = 200, Stock = 20 }
            };
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(products);

            // Act
            var result = await _productService.GetAllProducts();

            // Assert
            result.Should().HaveCount(2);
            _mockRepo.Verify(repo => repo.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetProductById_WithValidId_ShouldReturnProduct()
        {
            // Verifica que se retorne un producto específico cuando el ID existe

            // Arrange
            var product = new Product 
            { 
                Id = 1, 
                Name = "Test", 
                Description = "Desc", 
                Price = 100, 
                Stock = 10 
            };
            _mockRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(product);

            // Act
            var result = await _productService.GetProductById(1);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Name.Should().Be("Test");
        }

        [Fact]
        public async Task CreateProduct_WithValidData_ShouldCreateProduct()
        {
            // Verifica que se cree correctamente un producto con datos válidos

            // Arrange
            var createDto = new CreateProductDTO
            {
                Name = "New Product",
                Description = "New Description",
                Price = 150,
                Stock = 15
            };

            var createdProduct = new Product
            {
                Id = 1,
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                Stock = createDto.Stock
            };

            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<Product>()))
                    .ReturnsAsync(createdProduct);

            // Act
            var result = await _productService.CreateProduct(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(createDto.Name);
            result.Price.Should().Be(createDto.Price);
        }

        [Fact]
        public async Task UpdateProduct_WithValidData_ShouldUpdateProduct()
        {
            // Verifica que se actualice correctamente un producto existente

            // Arrange
            var productId = 1;
            var updateDto = new UpdateProductDTO
            {
                Name = "Updated Product",
                Description = "Updated Description",
                Price = 200,
                Stock = 20
            };

            var existingProduct = new Product
            {
                Id = productId,
                Name = "Original Name",
                Description = "Original Description",
                Price = 100,
                Stock = 10
            };

            _mockRepo.Setup(repo => repo.GetByIdAsync(productId))
                    .ReturnsAsync(existingProduct);

            // Act
            await _productService.UpdateProduct(productId, updateDto);

            // Assert
            _mockRepo.Verify(repo => repo.UpdateAsync(It.Is<Product>(p =>
                p.Id == productId &&
                p.Name == updateDto.Name &&
                p.Description == updateDto.Description &&
                p.Price == updateDto.Price &&
                p.Stock == updateDto.Stock
            )), Times.Once);
        }

        [Fact]
        public async Task DeleteProduct_WithValidId_ShouldDeleteProduct()
        {
            // Verifica que se elimine correctamente un producto

            // Arrange
            var productId = 1;
            var existingProduct = new Product { Id = productId };
            _mockRepo.Setup(repo => repo.GetByIdAsync(productId))
                    .ReturnsAsync(existingProduct);

            // Act
            await _productService.DeleteProduct(productId);

            // Assert
            _mockRepo.Verify(repo => repo.DeleteAsync(productId), Times.Once);
        }
    }
}