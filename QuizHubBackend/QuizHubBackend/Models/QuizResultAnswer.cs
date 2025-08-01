using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Models
{
    public class QuizResultAnswer
    {
        public int Id { get; set; }

        public string Text { get; set; }
        

        public int QuizResultId { get; set; }
        public QuizResult QuizResult { get; set; }

        //public int AnswerId { get; set; }
        //public Answer Answer { get; set; }

    }
}
