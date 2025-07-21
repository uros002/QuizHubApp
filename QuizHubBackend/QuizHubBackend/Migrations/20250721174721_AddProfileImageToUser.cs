using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class AddProfileImageToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Users",
                newName: "ProfileImage");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfileImage",
                table: "Users",
                newName: "Image");
        }
    }
}
