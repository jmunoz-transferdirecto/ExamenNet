using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly ILogger<ProductsController> _logger;
        private readonly TokenService _tokenService;

        public ProductsController(
            ProductService productService,
            ILogger<ProductsController> logger,
            TokenService tokenService)
        {
            _productService = productService;
            _logger = logger;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var products = await _productService.GetAllProducts();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var product = await _productService.GetProductById(id);
                if (product == null)
                    return NotFound();
                return Ok(product);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct(CreateProductDTO createProductDto)
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var createdProduct = await _productService.CreateProduct(createProductDto);
                return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDTO>> UpdateProduct(int id, UpdateProductDTO updateProductDto)
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var updatedProduct = await _productService.UpdateProduct(id, updateProductDto);
                return Ok(updatedProduct);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                await _productService.DeleteProduct(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}