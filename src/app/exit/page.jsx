"use client";

import React from "react";
import { exampleExitQuestionnaire } from "../../utils/questionnaires/ExampleExitQuestionnaire";
import { Questionnaire } from "../../components/likert/Questionnaire";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchParticipantProgress } from "../api/Progress";

const Page = () => {
  const {
    data: participantProgress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useQuery(["participantProgress"], fetchParticipantProgress, {
    staleTime: Infinity,
  });

  if (isProgressLoading) return <div></div>;
  if (isProgressError) return <div>An error occurred</div>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 md:p-12 ">
        {!participantProgress.exit_survey_completed ? (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Post-intervention questionnaire
            </h1>
            <p>
              By submitting this questionnaire, you confirm that you have
              practiced 4-7-8 Breathing twice daily for four weeks.
            </p>
            <Questionnaire surveyData={exampleExitQuestionnaire} />
          </>
        ) : (
          <>
            <p className="text-md md:text-lg text-gray-600">
              Post-intervention questionnaire has been filled in. Thank you for
              your participation!
            </p>
            <Link
              href="/calendar"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Click here to go to the breathing calendar
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
