using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QuizHubBackend.Context;
using AutoMapper;
using QuizHubBackend.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Cors.Infrastructure;
using QuizHubBackend.Interfaces;
using QuizHubBackend.Services;

namespace QuizHubBackend
{
    public class Startup
    {

        private readonly string _cors = "cors";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            services.AddControllers();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
                options.JsonSerializerOptions.MaxDepth = 64; // Set the maximum depth to 64
            });
            services.AddControllers().AddNewtonsoftJson();

            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            var mapperConfig = new MapperConfiguration(mc =>
            
                mc.AddProfile(new Mapping.Mapping())

            );

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "QuizHubBackend", Version = "v1" });
            });

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "http://localhost:44398",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]))
                };
            });


            services.AddCors(options =>
            {
                //CorsPolicyBuilder builder = new CorsPolicyBuilder();
                options.AddPolicy(name: _cors, builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                           .AllowAnyHeader()
                            //.WithHeaders("Authorization", "Content-Type", "Accept") // eksplicitno
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });

            services.AddScoped<DbContext, AppDbContext>();
            services.AddScoped<IUserService, UserService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "QuizHubBackend v1"));
            }

            app.UseRouting();

            app.UseCors(_cors);

            app.UseHttpsRedirection();


            app.UseAuthentication();
            app.UseAuthorization();



            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
