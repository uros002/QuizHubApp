using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Models
{
    public class Question
    {

        public int Id { get; set; }

        public string Body { get; set; }

        public List<Answer> Answers { get; set; }

        public AnswerType AnswerType { get; set; }

       // public List<Answer> CorrectAnswers { get; set; }

        public int Points { get; set; }

        public int QuizId {get;set;}

        public Quiz Quiz { get; set; }

    }
}
