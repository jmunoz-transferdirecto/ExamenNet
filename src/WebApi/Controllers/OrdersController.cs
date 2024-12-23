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
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly ILogger<OrdersController> _logger;
        private readonly TokenService _tokenService;

        public OrdersController(
            OrderService orderService,
            ILogger<OrdersController> logger,
            TokenService tokenService)
        {
            _orderService = orderService;
            _logger = logger;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var orders = await _orderService.GetAllOrders();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(CreateOrderDTO orderDto)
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("X-Auth-Token", token);

                var order = await _orderService.CreateOrder(orderDto);
                return Ok(order);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Product not found");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}