using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class AddedParentQuestionFieldInQuestionEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentQuestion",
                table: "Questions",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentQuestion",
                table: "Questions");
        }
    }
}
