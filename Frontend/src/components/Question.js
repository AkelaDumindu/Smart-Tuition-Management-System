import React, { useState } from "react";
import { InputGroup } from "react-bootstrap";
import "./Question.css";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Assuming this is the correct path

const Question = ({ number, question, isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(
    JSON.parse(localStorage.getItem("answers")) || {}
  );

  const saveAnswer = (quesId, ans) => {
    const updatedAnswers = { ...answers, [quesId]: ans };
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));
  };

  const updateQuestionHandler = (ques) => {
    navigate(`/adminUpdateQuestion/${ques.quesId}/?quizId=${ques.quiz.quizId}`);
  };

  const deleteQuestionHandler = async (ques) => {
    console.log(`Delete handler triggered for question id: ${ques.id}`); // Debugging
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this question!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          // Delete the question from Firestore
          const questionRef = doc(db, "questions", ques.id); // Assuming `ques.id` is the document ID
          await deleteDoc(questionRef);
          swal("Question Deleted!", `Question with id ${ques.id} successfully deleted`, "success");
          onDelete(ques.id); // Trigger the parent callback to update the UI
        } catch (error) {
          console.error("Error deleting question:", error);
          swal("Error", "Failed to delete question. Please try again.", "error");
        }
      } else {
        swal(`Question with id ${ques.id} is safe`);
      }
    });
  };

  return (
    <div className="question__container">
      <div className="question__content">{number + ". " + question.content}</div>
      <div className="question__options">
        <InputGroup
          onChange={(e) => {
            saveAnswer(question.quesId, e.target.value);
          }}
        >
          <div className="question__options--2">
            <div className="question__options--optionDiv">
              <InputGroup.Radio value={"option1"} name={number} aria-label="option 1" />
              <span className="question__options--optionText">{question.option1}</span>
            </div>
            <div className="question__options--optionDiv">
              <InputGroup.Radio value={"option2"} name={number} aria-label="option 2" />
              <span className="question__options--optionText">{question.option2}</span>
            </div>
          </div>

          <div className="question__options--2">
            <div className="question__options--optionDiv">
              <InputGroup.Radio value={"option3"} name={number} aria-label="option 3" />
              <span className="question__options--optionText">{question.option3}</span>
            </div>
            <div className="question__options--optionDiv">
              <InputGroup.Radio value={"option4"} name={number} aria-label="option 4" />
              <span className="question__options--optionText">{question.option4}</span>
            </div>
          </div>
        </InputGroup>
      </div>
      {isAdmin && (
        <div>
          <p style={{ margin: "5px" }}>{`Correct Answer: ${question[question.answer]}`}</p>
          <hr />
          <div className="question__content--editButtons">
            <div
              onClick={() => updateQuestionHandler(question)}
              style={{
                margin: "2px 8px",
                textAlign: "center",
                color: "rgb(68 177 49)",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {`Update`}
            </div>

            <div
              onClick={() => deleteQuestionHandler(question)}
              style={{
                margin: "2px 8px",
                textAlign: "center",
                color: "red",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {`Delete`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
