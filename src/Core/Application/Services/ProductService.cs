using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDTO>> GetAllProducts()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock
            });
        }

        public async Task<ProductDTO> GetProductById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Producto con id {id} no encontrado");

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock
            };
        }

        public async Task<ProductDTO> CreateProduct(CreateProductDTO productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Stock = productDto.Stock
            };

            var result = await _productRepository.AddAsync(product);

            return new ProductDTO
            {
                Id = result.Id,
                Name = result.Name,
                Description = result.Description,
                Price = result.Price,
                Stock = result.Stock
            };
        }

        public async Task<ProductDTO> UpdateProduct(int id, UpdateProductDTO productDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
                throw new KeyNotFoundException($"Producto con id {id} no encontrado");

            existingProduct.Name = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.Price = productDto.Price;
            existingProduct.Stock = productDto.Stock;

            await _productRepository.UpdateAsync(existingProduct);

            return new ProductDTO
            {
                Id = existingProduct.Id,
                Name = existingProduct.Name,
                Description = existingProduct.Description,
                Price = existingProduct.Price,
                Stock = existingProduct.Stock
            };
        }

        public async Task DeleteProduct(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Producto con id {id} no encontrado");

            await _productRepository.DeleteAsync(id);
        }
    }
}