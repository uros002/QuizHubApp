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
                return Ok(token);
            }else if(token == "Password incorrect!")
            {
                return Ok(token);
            }
            else if(token == "User is not active!")
            {
                return BadRequest(token);
            }
        
            return Ok(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDTO dto)
        {
            var token = await _userService.Register(dto);
            return Ok(token);
        }

        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _userService.GetAllUsers();
            return Ok(result);
        }

    }
}
