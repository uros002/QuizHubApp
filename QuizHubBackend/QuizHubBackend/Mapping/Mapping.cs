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
            //CreateMap<QuizDTO, Quiz>()
            //    .ForMember(dest => dest.Id, opt => opt.Ignore())
            //    .ForMember(dest => dest.Difficulty, opt => opt.MapFrom(src => Enum.Parse<QuizDifficulty>(src.Difficulty)))
            //     .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions)); 
            //CreateMap<Question, QuestionDTO>().ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers)).ReverseMap();
            CreateMap<QuizDTO, Quiz>()
    .ForMember(dest => dest.Id, opt => opt.Ignore())
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
    .ForMember(dest => dest.NumOfQuestions, opt => opt.MapFrom(src => src.NumOfQuestions))
    .ForMember(dest => dest.TimeDuration, opt => opt.MapFrom(src => src.TimeDuration))
    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
    .ForMember(dest => dest.Difficulty, opt => opt.MapFrom(src => Enum.Parse<QuizDifficulty>(src.Difficulty)))
    .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
    .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));
           
            //CreateMap<QuestionDTO, Question>().ReverseMap();

            CreateMap<QuestionDTO, Question>()
    .ForMember(dest => dest.Body, opt => opt.MapFrom(src => src.Body))
    .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers))
    .ForMember(dest => dest.AnswerType, opt => opt.MapFrom(src => Enum.Parse<AnswerType>(src.AnswerType)))
    .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points));

            //CreateMap<Answer, AnswerDTO>().ReverseMap();

            CreateMap<AnswerDTO, Answer>()
    .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text))
    .ForMember(dest => dest.IsCorrect, opt => opt.MapFrom(src => src.IsCorrect));
        }
    }
}
