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
                    if (parentQuiz != null)
                    {

                        foreach (var parentQuestion in parentQuiz.Questions)
                        {
                            if (question.Body.Trim().ToLower().Equals(parentQuestion.Body.Trim().ToLower()))
                            {
                                question.ParentQuestion = parentQuestion.Id;
                                break;
                            }
                        }
                    }

                    quiz.QuizPoints += question.Points;

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
        public async Task<string> UpdateQuiz(QuizDTO quizDTO)
        {
            Console.WriteLine(JsonConvert.SerializeObject(quizDTO));
            Quiz quiz = _mapper.Map<Quiz>(quizDTO);

            Console.WriteLine("Mapped quiz:");
            Console.WriteLine(JsonConvert.SerializeObject(quiz));

            Quiz versionParentQuiz = await _appDbContext.Quizes.Where(q => q.Id == quiz.VersionParentQuiz).FirstOrDefaultAsync();
            if(versionParentQuiz == null)
            {
                return "Parent quiz for version is not existing!";
            }
            var versionOfParent = versionParentQuiz.Version;
            quiz.Version = versionOfParent + 1;
            int quizPoints = 0;

            if(quiz.Questions != null)
            {
                foreach(var question in quiz.Questions)
                {
                    question.Quiz = quiz;
                    quizPoints += question.Points;

                    foreach(var answer in question.Answers)
                    {
                        answer.Question = question;
                    }
                }
            }
            quiz.QuizPoints = quizPoints;

            _appDbContext.Quizes.Add(quiz);

            await _appDbContext.SaveChangesAsync();

            return "Quiz is updated successfully";

        }

        public async Task<string> DoQuiz(int quizId, QuizCompletitionDTO quizCompletitionDTO)
        {
            if (quizCompletitionDTO == null)
            {
                return "Error with doing quiz";
            }


            var quiz = await _appDbContext.Quizes.Include(q => q.Questions).ThenInclude(qn => qn.Answers).FirstOrDefaultAsync(q => q.Id == quizId);

            var parentQuiz = await _appDbContext.Quizes.Include(q => q.Questions).ThenInclude(qn => qn.Answers).FirstOrDefaultAsync(q => q.Id == quizCompletitionDTO.QuizId);

            if (quiz == null)
            {
                return "Error with fetching quiz";
            }

            var score = CalculateScore(quizCompletitionDTO.Answers, quiz);

            var timeDurationDoingQuiz = quiz.TimeDuration - quizCompletitionDTO.TimeLeft;
          

            var newQuiz = new Quiz {
                Name = quiz.Name,
                NumOfQuestions = quiz.NumOfQuestions,
                TimeDuration = timeDurationDoingQuiz,
                Description = quiz.Description,
                Difficulty = quiz.Difficulty,
                Category = quiz.Category,
                Version = quiz.Version,
                IsDeleted = false,
                UserId = quizCompletitionDTO.UserId,
                ParentQuiz = quizCompletitionDTO.QuizId,
                Questions = new List<Question>()
            };
            foreach (var question in quiz.Questions)
            {

                var parentQuestionId = parentQuiz.Questions.Where(q => q.Body.Trim().ToLower().Equals(question.Body.Trim().ToLower())).FirstOrDefault().Id;

                var newQuestion = new Question
                {
                    Body = question.Body,
                    AnswerType = question.AnswerType,
                    Points = question.Points,
                    Quiz = newQuiz,
                    Answers = new List<Answer>(),
                    ParentQuestion = parentQuestionId,
                };

                var given = quizCompletitionDTO.Answers
                   .Where(a => a.QuestionId == question.Id).ToList();
                

                if (given != null)
                {

                    foreach (var giv in given)
                    {
                        Answer ans = new Answer
                        {
                            QuestionId = question.Id,
                            Text = giv.Text,
                        };
                    newQuestion.Answers.Add(ans);
                    }


                }

                newQuiz.Questions.Add(newQuestion);
            }

           

            _appDbContext.Quizes.Add(newQuiz);
            await _appDbContext.SaveChangesAsync();


            var quizResult = new QuizResult
            {
                UserId = quizCompletitionDTO.UserId,
                QuizId = newQuiz.Id,
                Points = score.Points,
                TimeDuration = timeDurationDoingQuiz,
                DateOfCompletition = DateTime.UtcNow

            };
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
                    .Where(a => a.QuestionId == question.Id).ToList();

                if (given != null)
                {

                    var correctAnswers = question.Answers
                        .Where(a => a.IsCorrect).ToList();
                    if (IsCorrect(given, correctAnswers))
                    {
                        //points++;
                        points += question.Points;
                    }
                }
            }

            double percentage = quiz.Questions.Count > 0
                ? (double)points / quiz.Questions.Count * 100
                : 0;

            return (points, percentage);
        }

        private bool IsCorrect(List<AnswerDTO> given, List<Answer> correctAnswers)
        {
            return given.Select(g => g.Text.Trim().ToLower())
                        .OrderBy(t => t)
                        .SequenceEqual(correctAnswers.Select(c => c.Text.Trim().ToLower())
                                                     .OrderBy(t => t));
        }

        public async Task<List<QuizDTO>> GetAllQuizzes()
        {

            var quizzes = await _appDbContext.Quizes
        .Where(q => !q.IsDeleted && q.UserId == null)
        .Include(q => q.Questions)               // učitaj pitanja
            .ThenInclude(q => q.Answers)        // učitaj odgovore za pitanja
            .AsSplitQuery()
        .ToListAsync();


            var latestQuizzes = quizzes.Where(q => !quizzes.Any(other => other.VersionParentQuiz == q.Id)).ToList();

            var quizDtos = _mapper.Map<List<QuizDTO>>(latestQuizzes);

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
            var results = await _appDbContext.QuizResults.Where(q => q.UserId == userId && !q.IsDeleted).ToListAsync();

            var resultsDTOs = _mapper.Map<List<QuizResultDTO>>(results);

            return resultsDTOs;
        }


        public async Task<List<QuizResultDTO>> GetAllResults()
        {
            var results = await _appDbContext.QuizResults.Where(q => !q.IsDeleted).ToListAsync();

            var resultsDTOs = _mapper.Map<List<QuizResultDTO>>(results);

            return resultsDTOs;
        }

        public async Task<string> DeleteQuiz(int quizId)
        {
            Quiz quiz = await _appDbContext.Quizes.Where(q => q.Id == quizId).FirstOrDefaultAsync();

            

            quiz.IsDeleted = true;

            List<Quiz> connectedQuizzes = _appDbContext.Quizes.Where(q => q.ParentQuiz == quizId).ToList();

           
            
            foreach(var conQuiz in connectedQuizzes)
            {
                conQuiz.IsDeleted = true;
                QuizResult result = _appDbContext.QuizResults.Where(q => q.QuizId == conQuiz.Id).FirstOrDefault();

                result.IsDeleted = true;
            }

            await _appDbContext.SaveChangesAsync();

            return "Quiz is deleted!";

        }
    }
}
