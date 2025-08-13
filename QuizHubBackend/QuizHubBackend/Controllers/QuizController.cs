using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizHubBackend.DTO;
using QuizHubBackend.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Controllers
{
    [Route("api/quizzes")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;
    
        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }


        
        [HttpGet("getAllQuizzes")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            List<QuizDTO> quizzes = await _quizService.GetAllQuizzes();
            return Ok(quizzes);
        }

        [HttpGet("getAllQuizzesForResults")]
        public async Task<IActionResult> GetAllQuizzesForResults()
        {
            List<QuizDTO> quizzes = await _quizService.GetAllQuizzesForResults();
            return Ok(quizzes);
        }

        [Authorize]
        [HttpPost("createQuiz")]
        public async Task<IActionResult> CreateQuiz([FromBody]QuizDTO quizDTO)
        {
            string result = await _quizService.CreateQuiz(quizDTO);
            return Ok(result);
        }

        [HttpPost("doQuiz/{quizId}")]
        public async Task<IActionResult> DoQuiz(int quizId, [FromBody]QuizCompletitionDTO dto)
        {
            string result = await _quizService.DoQuiz(quizId, dto);
            return Ok(result);
        }

        [HttpGet("getMyResults/{userId}")]
        public async Task<IActionResult> GetMyResults(int userId)
        {
            List<QuizResultDTO> results = await _quizService.GetMyResults(userId);
            return Ok(results);
        }

        [HttpPost("updateQuiz")]
        public async Task<IActionResult> UpdateQuiz(QuizDTO quizDTO)
        {
            string result = await _quizService.UpdateQuiz(quizDTO);
            return Ok(result);
        }
    }
}
