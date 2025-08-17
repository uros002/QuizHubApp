using QuizHubBackend.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Interfaces
{
    public interface IQuizService
    {

        Task<List<QuizDTO>> GetAllQuizzes();

        Task<List<QuizDTO>> GetAllQuizzesForResults();

        Task<String> CreateQuiz(QuizDTO quizDTO);

        Task<String> DoQuiz(int quizId, QuizCompletitionDTO quizCompletitionDTO);

        Task<List<QuizResultDTO>> GetMyResults(int userId);

        Task<List<QuizResultDTO>> GetAllResults();

        Task<String> UpdateQuiz(QuizDTO quizDTO);

        Task<String> DeleteQuiz(int quizId);
    }
}
