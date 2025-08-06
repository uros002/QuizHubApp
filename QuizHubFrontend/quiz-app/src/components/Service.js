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
    const response = await api.post("api/quizzes/createQuiz", quizData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 200) {
      return response.data; // Assuming the API returns the created quiz
    }
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};
