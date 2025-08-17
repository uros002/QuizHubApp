using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class QuizDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int NumOfQuestions { get; set; }
        public int TimeDuration { get; set; } // in seconds
        public string Description { get; set; }
        public string Difficulty { get; set; } // as string: Easy/Medium/Hard

        public int ParentQuiz { get; set; }    
    
        public int? VersionParentQuiz { get; set; }
         public string Category { get; set; } // e.g., "programming", "history", etc.

        public List<QuestionDTO> Questions { get; set; } // optional: only include when needed

        public int QuizPoints { get; set; }
}

}