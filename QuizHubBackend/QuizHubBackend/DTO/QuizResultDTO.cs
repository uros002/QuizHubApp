using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.DTO
{
    public class QuizResultDTO
    {
         public int Id { get; set; }
    public int UserId { get; set; }
    public string QuizName { get; set; }
    public int QuizId { get; set; }
    public int Points { get; set; }
    public int RightAnwers { get; set; }
    public int TimeDuration { get; set; }
    public DateTime DateOfCompletition { get; set; }
    //public List<QuizResultAnswerDTO> SelectedAnswers { get; set; }
    }
}