using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class RegisterDTO
    {
        public string Id { get; set; }
        public string Username { get; set; }

        public string Password { get; set; }

        public IFormFile ProfileImage { get; set; }

       

        public string Email { get; set; }
    }
}
