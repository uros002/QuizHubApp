using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Models
{
    public class QuizResult
    {

        public int Id { get; set; }

        public User User { get; set; }
        public int UserId { get; set; }

        public Quiz Quiz { get; set; }
        public int QuizId {get;set;}
        public List<QuizResultAnswer> SelectedAnswers { get; set; }

        public int RightAnwers { get; set; }

        public int Points { get; set; }

        public int TimeDuration { get; set; }

        public DateTime DateOfCompletition { get; set; }

    }
}
