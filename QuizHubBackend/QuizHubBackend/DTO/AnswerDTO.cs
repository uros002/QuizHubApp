using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class AnswerDTO
    {
         public int Id { get; set; }
    public string Text { get; set; }
    // Do not expose IsCorrect unless it's for admin or review mode
    public bool? IsCorrect { get; set; } // nullable if conditional
        public int? QuestionId { get; set; }
    }
}