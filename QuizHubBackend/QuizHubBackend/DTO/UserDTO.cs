using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace QuizHubBackend.DTO
{
    public class UserDTO
    {

        public string Username { get; set; }

        public string Password { get; set; }

        public IFormFile ProfileImage { get; set; }

        public string Email { get; set; }
    }
}
