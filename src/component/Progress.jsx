import React from "react";

const Progress = ({ index, questionlength, points, maxPoints, answer }) => {
  return (
    <header className="progress">
      <progress max={questionlength} value={index + (answer != null)} />
      <p>
        Question/ <strong>{index + 1}</strong> {questionlength}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
};

export default Progress;
