using Microsoft.AspNetCore.Mvc;
using QuizHubBackend.DTO;
using QuizHubBackend.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;


        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var token = await _userService.Login(dto);
            if(token == "User does not exist!")
            {
                return NotFound(token);
            }else if(token == "Password incorrect!")
            {
                return Unauthorized(token);
            }
            else if(token == "User does not exist!")
            {
                return BadRequest(token);
            }
        
            return Ok(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserDTO dto)
        {
            var token = await _userService.Register(dto);
            return Ok(token);
        }

    }
}
