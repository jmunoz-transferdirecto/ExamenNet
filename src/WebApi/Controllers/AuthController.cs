using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpGet("token")]
        public IActionResult GetToken()
        {
            try
            {
                var token = _tokenService.GenerateToken();
                Response.Headers.Add("Access-Control-Expose-Headers", "X-Auth-Token");
                Response.Headers.Add("X-Auth-Token", token);
                return Ok(new { token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}