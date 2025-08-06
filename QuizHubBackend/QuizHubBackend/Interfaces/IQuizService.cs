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

        Task<String> CreateQuiz(QuizDTO quizDTO);
    }
}
