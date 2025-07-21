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
        }
    }
}
