using AutoMapper;
using QuizHubBackend.DTO;
using QuizHubBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizHubBackend.Mapping
{
    public class Mapping:Profile
    {
       public Mapping()
        {
            CreateMap<User, UserDTO>().ReverseMap().ForMember(dest => dest.ProfileImage, opt => opt.Ignore());;
            CreateMap<User, LoginDTO>().ReverseMap();
            CreateMap<Quiz, QuizDTO>().ForMember(dest => dest.Difficulty, opt => opt.MapFrom(src => src.Difficulty.ToString()))
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));
            CreateMap<Question, QuestionDTO>().ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers));
            CreateMap<Answer, AnswerDTO>();
        }
    }
}
