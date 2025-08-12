using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class AddedParentQuizFieldInQuizEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentQuiz",
                table: "Quizes",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentQuiz",
                table: "Quizes");
        }
    }
}
