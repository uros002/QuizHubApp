using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class AddedQuizPointsInQuizEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuizPoints",
                table: "Quizes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuizPoints",
                table: "Quizes");
        }
    }
}
