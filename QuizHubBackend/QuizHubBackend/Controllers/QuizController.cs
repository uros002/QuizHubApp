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


        [Authorize]
        [HttpGet("getAllQuizzes")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            List<QuizDTO> quizzes = await _quizService.GetAllQuizzes();
            return Ok(quizzes);
        }

        [Authorize]
        [HttpPost("createQuiz")]
        public async Task<IActionResult> CreateQuiz([FromBody]QuizDTO quizDTO)
        {
            string result = await _quizService.CreateQuiz(quizDTO);
            return Ok(result);
        }

    }
}
