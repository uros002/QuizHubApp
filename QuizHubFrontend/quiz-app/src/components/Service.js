import { useContext } from "react";
import api from "../ApiMaker";

export const getAllQuizzes = async () => {
  try {
    const response = await api.get("api/quizzes/getAllQuizzes");
    if (response.status === 200) {
      return response.data.$values;
    }
    throw new Error("Failed to fetch quizzes");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await api.post("api/quizzes/createQuiz", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(quizData),
    });
    if (response.status === 200) {
      return "OK"; // Assuming the API returns the created quiz
    }
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};
