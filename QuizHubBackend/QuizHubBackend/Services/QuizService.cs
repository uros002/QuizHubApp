using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QuizHubBackend.Context;
using QuizHubBackend.DTO;
using QuizHubBackend.Interfaces;
using QuizHubBackend.Models;
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

        public async Task<string> CreateQuiz(QuizDTO quizDTO)
        {
            Console.WriteLine(JsonConvert.SerializeObject(quizDTO));
            Quiz quiz = _mapper.Map<Quiz>(quizDTO);

            Console.WriteLine("Mapped quiz:");
            Console.WriteLine(JsonConvert.SerializeObject(quiz));

            quiz.Version = 1;
            quiz.IsDeleted = false;

            if (quiz.Questions != null)
            {
                foreach (var question in quiz.Questions)
                {
                    question.Quiz = quiz;

                    if (question.Answers != null)
                    {
                        foreach (var answer in question.Answers)
                        {
                            answer.Question = question;
                        }
                    }
                }
            }

            _appDbContext.Quizes.Add(quiz);


            

            await _appDbContext.SaveChangesAsync();

            return "Quiz is created";

        }

     

        public async Task<List<QuizDTO>> GetAllQuizzes()
        {
            return _mapper.Map<List<QuizDTO>>(await _appDbContext.Quizes.Where(q => !q.IsDeleted).ToListAsync());
        }
    }
}
