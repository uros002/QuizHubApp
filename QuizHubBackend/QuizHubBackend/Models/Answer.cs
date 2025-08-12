using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Models
{
    public class Answer
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public bool IsCorrect { get; set; }
        
       // public bool? IsSelected { get; set; }

        public int QuestionId { get; set; }

        public Question Question { get; set; }

       // public List<QuizResultAnswer> QuizResultAnswers { get; set; }


    }
}
