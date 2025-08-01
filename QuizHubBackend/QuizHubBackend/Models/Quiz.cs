using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Models
{

    

    public class Quiz
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int NumOfQuestions { get; set; }

        public int TimeDuration { get; set; } // in seconds

        public string Description { get; set; }

        public QuizDifficulty Difficulty { get; set; }

        public List<Question> Questions { get; set; }

        
    }
}
