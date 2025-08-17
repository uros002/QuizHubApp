using QuizHubBackend.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Interfaces
{
    public interface IUserService
    {
        Task<string> Login(LoginDTO dto);

        Task<string> Register(RegisterDTO dto);

        Task<List<UserDTO>> GetAllUsers();
    }
}
