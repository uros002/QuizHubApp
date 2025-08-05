using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuizHubBackend.Context;
using QuizHubBackend.DTO;
using QuizHubBackend.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Services
{
    public class QuizService : IQuizService
    {
        private readonly IConfigurationSection _secretKey;
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public QuizService(AppDbContext appDbContext, IMapper mapper, IConfiguration config)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
            _secretKey = config.GetSection("SecretKey");
        }
        public async Task<List<QuizDTO>> GetAllQuizzes()
        {
            return _mapper.Map<List<QuizDTO>>(await _appDbContext.Quizes.Where(q => !q.IsDeleted).ToListAsync());
        }
    }
}
