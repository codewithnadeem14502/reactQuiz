import React from "react";

const StartScreen = ({ questionlength, dispatch }) => {
  return (
    <div className="start">
      <h2>welcome to react quick </h2>
      <h3>{questionlength} question to test your react knnoweldge</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
};

export default StartScreen;
