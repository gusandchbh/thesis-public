"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Questionnaire } from "../../components/likert/Questionnaire";
import { exampleEntryQuestionnaire } from "../../utils/questionnaires/ExampleEntryQuestionnaire";
import Link from "next/link";
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
        {!participantProgress.entry_survey_completed ? (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold mb-6">
              Pre-intervention questionnaire
            </h1>
            <Questionnaire surveyData={exampleEntryQuestionnaire} />
          </>
        ) : (
          <>
            <p className="text-xl md:text-2xl font-light mb-10">
              Thank you for completing the pre-intervention questionnaire.
            </p>
            <Link
              href="/calendar"
              className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 text-base font-medium rounded-md text-white btn-background hover:btn-background-hover"
            >
              <button className="w-full px-4 py-2 bg-btn-background text-white rounded-md hover:bg-btn-background-hover focus:outline-none ">
                Proceed to the breathing calendar
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
