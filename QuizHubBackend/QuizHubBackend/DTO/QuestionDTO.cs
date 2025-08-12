using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class QuestionDTO
    {
          public int Id { get; set; }
    public string Body { get; set; }
    public List<AnswerDTO> Answers { get; set; }
    public string AnswerType { get; set; } // OneCorrect, TrueFalse, etc.
    public int Points { get; set; }
        public int ParentQuestion { get; set; }

        public int? QuizId { get; set; }
    }
}