import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

const BreathingExercise = ({ onSessionCompleted, exerciseId }) => {
  const [stage, setStage] = useState("");
  const [cycleCount, setCycleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const totalCycles = 4;

  const breathingSpring = useSpring({
    scale: stage === "exhale" ? 0.75 : 1.2,
    from: { scale: 0.75 },
    config: {
      duration: stage === "inhale" ? 4000 : stage === "exhale" ? 8000 : 0,
    },
    immediate: stage === "hold",
  });

  useEffect(() => {
    let timer;
    let seconds;

    if (started && cycleCount <= totalCycles) {
      switch (stage) {
        case "inhale":
          seconds = 4;
          break;
        case "hold":
          seconds = 7;
          break;
        case "exhale":
          seconds = 8;
          break;
        default:
          seconds = 0;
          break;
      }

      setCountdown(seconds);
      timer = setInterval(() => {
        setCountdown((c) => (c > 0 ? c - 1 : c));
      }, 1000);

      const nextStageTimeout = setTimeout(() => {
        clearInterval(timer);
        if (stage === "exhale") {
          if (cycleCount < totalCycles) {
            setCycleCount((prevCount) => prevCount + 1);
            setStage("inhale");
          } else {
            setStage("completed");
            setStarted(false);
            onSessionCompleted({ completed: true, exerciseId });
          }
        } else {
          setStage(stage === "inhale" ? "hold" : "exhale");
        }
      }, seconds * 1000);

      return () => {
        clearInterval(timer);
        clearTimeout(nextStageTimeout);
      };
    }
  }, [stage, started, cycleCount, onSessionCompleted, exerciseId]);

  const startExercise = () => {
    setCycleCount(1);
    setStage("inhale");
    setStarted(true);
  };

  const buttonText = started ? "In Progress" : "Begin exercise";
  const displayText = stage.charAt(0).toUpperCase() + stage.slice(1);

  return (
    <div>
      <div className="flex flex-col items-center justify-center font-sans my-4">
        <animated.div
          className="flex items-center justify-center relative flex-col w-48 h-48 rounded-full bg-sky-800 shadow-md mb-10"
          style={{
            transform: breathingSpring.scale.to((scale) => `scale(${scale})`),
          }}
        >
          {!started && stage !== "completed" && (
            <button
              onClick={startExercise}
              className="px-5 py-2.5 mt-6 text-stone-200 text-lgr"
            >
              {buttonText}
            </button>
          )}
          <p className="text-2xl text-stone-200 capitalize pt-5">
            {displayText}
          </p>
          {started && <p className="text-3xl text-stone-200">{countdown}</p>}
        </animated.div>
        {started && (
          <h4 className="text-lg text-stone-200 mb-5">
            Cycle: {cycleCount} / {totalCycles}
          </h4>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
