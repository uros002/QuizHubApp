using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizHubBackend.Migrations
{
    public partial class ModelsForQuizAndUserUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizResultAnswers");

            migrationBuilder.DropColumn(
                name: "RightAnwers",
                table: "QuizResults");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Quizes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Quizes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Quizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Quizes_UserId",
                table: "Quizes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizes_Users_UserId",
                table: "Quizes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizes_Users_UserId",
                table: "Quizes");

            migrationBuilder.DropIndex(
                name: "IX_Quizes_UserId",
                table: "Quizes");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Quizes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Quizes");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Quizes");

            migrationBuilder.AddColumn<int>(
                name: "RightAnwers",
                table: "QuizResults",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "QuizResultAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizResultId = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizResultAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizResultAnswers_QuizResults_QuizResultId",
                        column: x => x.QuizResultId,
                        principalTable: "QuizResults",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizResultAnswers_QuizResultId",
                table: "QuizResultAnswers",
                column: "QuizResultId");
        }
    }
}
