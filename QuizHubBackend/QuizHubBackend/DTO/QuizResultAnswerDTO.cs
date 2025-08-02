using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class QuizResultAnswerDTO
    {
         public int Id { get; set; }
    public string Text { get; set; }
    public int QuestionId { get; set; }
    public string QuestionText { get; set; }
    public List<int> CorrectAnswers { get; set; }
    public bool IsCorrect { get; set; }
    }
}