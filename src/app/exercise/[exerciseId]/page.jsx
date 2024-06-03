"use client";
import React, { useState } from "react";
import BreathingExercise from "../../../components/breathing/BreathingExercise";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeSession } from "../../api/Exercise";
import Link from "next/link";

const Page = ({ params }) => {
  const exerciseId = params.exerciseId;
  const queryClient = useQueryClient();
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const mutation = useMutation(completeSession, {
    onSuccess: () => {
      queryClient.invalidateQueries(["exercisesData"]);
    },
    onError: (error) => {
      console.error("Error updating session:", error);
    },
  });

  const handleSessionCompleted = (data) => {
    if (data.completed) {
      setExerciseCompleted(true);
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  const handleCompleteSession = () => {
    mutation.mutate(exerciseId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-4">
      <BreathingExercise
        onSessionCompleted={handleSessionCompleted}
        exerciseId={exerciseId}
      />
      <Link href={"/calendar"}>
        <button
          onClick={handleCompleteSession}
          className="px-5 py-2.5 border-none rounded text-stone-200 text-lg bg-green-600 hover:bg-green-800"
        >
          Mark as completed
        </button>
      </Link>

      <button
        onClick={toggleInstructions}
        className=" mt-4 px-5 py-2.5 border-none rounded text-stone-200 text-lg bg-sky-500 hover:bg-sky-700 cursor-pointer"
      >
        {showInstructions ? "Hide instructions" : "Show instructions"}
      </button>

      {showInstructions && (
        <div className="m-6 pt-2  max-w-prose">
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            1. Choose a comfortable position.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            2. Place your tongue in the yogic position (touching the tip of your
            tongue to the ridge of tissue just behind the upper front teeth)
          </p>
          <p className="m-b-2 mt-2 text-md text-warm-gray ">
            3. Exhale completely through the mouth, making an audible sound.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            4. Close your mouth and inhale quietly through the nose for four
            seconds.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            5. Hold the breath for a seven seconds.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            6. Exhale completely through the mouth for eight seconds, making an
            audible sound.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            7. Repeat this for a total of four cycles.
          </p>
          <p className="mb-2 mt-2 text-md text-warm-gray ">
            If it&apos;s difficult to exhale with your tongue in the yogic
            position you can try pursing your lips.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
