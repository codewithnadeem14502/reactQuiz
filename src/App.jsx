import { useEffect, useReducer } from "react";
import Loader from "./component/Loader";
import Error from "./component/Error";
import Header from "./component/Header";
import StartScreen from "./component/StartScreen";
import Question from "./component/Question";
import NextButton from "./component/NextButton";
import Progress from "./component/Progress";
import Finished from "./component/Finished";
import Footer from "./component/Footer";
import Timer from "./component/Timer";

const SECS = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecevied":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        // ...state,
        // highscore: 0,
        // points: 0,
        // answer: null,
        // index: 0,
        // status: "ready",
        ...initialState,
        qeustion: state.quesion,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("action unknown bhai");
  }
}

const App = () => {
  const [
    { index, questions, status, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const questionlength = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  useEffect(function () {
    fetch("https://react-quiz-five-jet.vercel.app/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecevied", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div>
      <Header />

      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && (
        <StartScreen questionlength={questionlength} dispatch={dispatch} />
      )}
      {status === "active" && (
        <>
          <Progress
            index={index}
            points={points}
            maxPoints={maxPoints}
            questionlength={questionlength}
            answer={answer}
          />
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
          <Footer>
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              questionlength={questionlength}
            />
          </Footer>
        </>
      )}
      {status === "finished" && (
        <Finished
          points={points}
          highscore={highscore}
          dispatch={dispatch}
          maxPoints={maxPoints}
        />
      )}
    </div>
  );
};

export default App;
