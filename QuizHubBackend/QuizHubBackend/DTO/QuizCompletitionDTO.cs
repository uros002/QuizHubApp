using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class QuizCompletitionDTO
    {
        public int UserId { get; set; }

        public int QuizId { get; set; }

        public  List<AnswerDTO> Answers { get; set; }

        public int TimeLeft { get; set; }
    }
}
