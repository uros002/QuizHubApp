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

            Quiz parentQuiz = await  _appDbContext.Quizes.Where(q => q.Id == quiz.ParentQuiz).FirstOrDefaultAsync();



            quiz.Version = 1;
            quiz.IsDeleted = false;

            if (quiz.Questions != null)
            {
                foreach (var question in quiz.Questions)
                {
                    foreach (var parentQuestion in parentQuiz.Questions)
                    {
                        if (question.Body.Trim().ToLower().Equals(parentQuestion.Body.Trim().ToLower()))
                        {
                            question.ParentQuestion = parentQuestion.Id;
                            break;
                        }
                    }

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

        public async Task<string> DoQuiz(int quizId, QuizCompletitionDTO quizCompletitionDTO)
        {
            if (quizCompletitionDTO == null)
            {
                return "Error with doing quiz";
            }


            var quiz = await _appDbContext.Quizes.Include(q => q.Questions).ThenInclude(qn => qn.Answers).FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                return "Error with fetching quiz";
            }

            var score = CalculateScore(quizCompletitionDTO.Answers, quiz);

            var quizResult = new QuizResult
            {
                UserId = quizCompletitionDTO.UserId,
                QuizId = quizCompletitionDTO.QuizId,
                Points = score.Points,
                TimeDuration = quizCompletitionDTO.TimeLeft,
                DateOfCompletition = DateTime.UtcNow

            };

            var newQuiz = new Quiz {
                Name = quiz.Name,
                NumOfQuestions = quiz.NumOfQuestions,
                TimeDuration = quiz.TimeDuration,
                Description = quiz.Description,
                Difficulty = quiz.Difficulty,
                Category = quiz.Category,
                Version = quiz.Version,
                IsDeleted = false,
                UserId = quizCompletitionDTO.UserId,
                Questions = new List<Question>()
            };
            foreach (var question in quiz.Questions)
            {


                var newQuestion = new Question
                {
                    Body = question.Body,
                    AnswerType = question.AnswerType,
                    Points = question.Points,
                    Quiz = newQuiz,
                    Answers = new List<Answer>()
                };

                var given = quizCompletitionDTO.Answers
                   .FirstOrDefault(a => a.QuestionId == question.Id);
                

                if (given != null)
                {

                    Answer ans = new Answer
                    {
                        QuestionId = question.Id,
                        Text = given.Text
                    };


                    newQuestion.Answers.Add(ans);
                }

                newQuiz.Questions.Add(newQuestion);
            }

           

            _appDbContext.Quizes.Add(newQuiz);
            _appDbContext.QuizResults.Add(quizResult);

            await _appDbContext.SaveChangesAsync();


            return "Quiz is done!";
        }

        private (int Points, double Percentage) CalculateScore(List<AnswerDTO> givenAnswers, Quiz quiz)
        {
            int points = 0;
            List<bool> answersTruFalse = new List<bool>();
            foreach (var question in quiz.Questions)
            {
                var given = givenAnswers
                    .FirstOrDefault(a => a.QuestionId == question.Id);

                if (given != null)
                {
                    var correctAnswer = question.Answers
                        .FirstOrDefault(a => a.IsCorrect);

                    if (correctAnswer != null && correctAnswer.Text.ToLower().Equals(given.Text.ToLower()))
                    {
                        points++;
                       // answersTruFalse.Add(true);
                    }
                    else
                    {
                       // answersTruFalse.Add(false);
                    }
                }
            }

            double percentage = quiz.Questions.Count > 0
                ? (double)points / quiz.Questions.Count * 100
                : 0;

            return (points, percentage);
        }

        public async Task<List<QuizDTO>> GetAllQuizzes()
        {

            var quizzes = await _appDbContext.Quizes
        .Where(q => !q.IsDeleted && q.UserId == null)
        .Include(q => q.Questions)               // učitaj pitanja
            .ThenInclude(q => q.Answers)        // učitaj odgovore za pitanja
            .AsSplitQuery()
        .ToListAsync();

            var quizDtos = _mapper.Map<List<QuizDTO>>(quizzes);

            return quizDtos;
        }

        public async Task<List<QuizDTO>> GetAllQuizzesForResults()
        {

            var quizzes = await _appDbContext.Quizes
        .Where(q => !q.IsDeleted )
        .Include(q => q.Questions)               // učitaj pitanja
            .ThenInclude(q => q.Answers)        // učitaj odgovore za pitanja
            .AsSplitQuery()
        .ToListAsync();

            var quizDtos = _mapper.Map<List<QuizDTO>>(quizzes);

            return quizDtos;
        }

        public async Task<List<QuizResultDTO>> GetMyResults(int userId)
        {
            var results = await _appDbContext.QuizResults.Where(q => q.UserId == userId).ToListAsync();

            var resultsDTOs = _mapper.Map<List<QuizResultDTO>>(results);

            return resultsDTOs;
        }
    }
}
