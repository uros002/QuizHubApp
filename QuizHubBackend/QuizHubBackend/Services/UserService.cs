using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QuizHubBackend.Context;
using QuizHubBackend.DTO;
using QuizHubBackend.Interfaces;
using QuizHubBackend.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QuizHubBackend.Services
{
    public class UserService : IUserService
    {
        private readonly IConfigurationSection _secretKey;
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public UserService(AppDbContext appDbContext,IMapper mapper)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
        }

        public async Task<string> Login(LoginDTO dto)
        {
            User user = await _appDbContext.Users.FirstOrDefaultAsync(x => x.Username == dto.Username);

            if(user == null)
            {
                return "User does not exist!";
            }

            if (BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                List<Claim> claims = new List<Claim>();

                if(dto.Username == "admin")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "Admin"));
                }

                SymmetricSecurityKey seckretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signingCredentials = new SigningCredentials(seckretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44398",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signingCredentials
                    ) ;
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return tokenString;
            }
            else
            {
                return "Password incorrect!";
            }

        }
    }
}
