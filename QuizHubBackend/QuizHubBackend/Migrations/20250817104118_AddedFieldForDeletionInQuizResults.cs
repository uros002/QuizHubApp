using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class AddedFieldForDeletionInQuizResults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "QuizResults",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "QuizResults");
        }
    }
}
