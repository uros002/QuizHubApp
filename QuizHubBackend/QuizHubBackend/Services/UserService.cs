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
using System.IO;
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

        public UserService(AppDbContext appDbContext, IMapper mapper,IConfiguration config)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
            _secretKey = config.GetSection("SecretKey");
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

                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
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

        public async Task<string> Register(UserDTO dto)
        {
            if (await _appDbContext.Users.FirstOrDefaultAsync(x => x.Username == dto.Username) != null)
            {
                return "Username already exists!";
            }
            if (await _appDbContext.Users.FirstOrDefaultAsync(x => x.Email == dto.Email) != null)
            {
                return "Email already exists!";
            }

            dto.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            User user = _mapper.Map<User>(dto);

           if (dto.ProfileImage != null && dto.ProfileImage.Length > 0)
            {
                using (var ms = new MemoryStream()){
                    await dto.ProfileImage.CopyToAsync(ms);
                    user.ProfileImage = ms.ToArray();
                }
            }

            await _appDbContext.Users.AddAsync(user);
            await _appDbContext.SaveChangesAsync();

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            List<Claim> claims = new List<Claim>(){
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };
            
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44398",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signingCredentials
                    );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            Console.WriteLine("Token: " + tokenString);
            return tokenString;


        }
    }
}
