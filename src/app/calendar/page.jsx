"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DayCard from "../../components/calendar/DayCard";
import { fetchExercises } from "../api/Exercise";
import {
  fetchDaysSinceEntryQuestionnaire,
  fetchParticipantProgress,
} from "../api/Progress";
import InfoModal from "../../components/calendar/InfoModal";

const CalendarPage = () => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    data: participantProgress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useQuery(["participantProgress"], fetchParticipantProgress, {
    staleTime: Infinity,
  });

  const {
    data: exercises,
    isLoading: isExercisesLoading,
    isError: isExercisesError,
    error,
  } = useQuery(["exercisesData"], fetchExercises, {
    staleTime: 60,
  });

  const {
    data: daysSinceEntryQuestionnaire = 0,
    isLoading: isDaysLoading,
    isError: isDaysError,
  } = useQuery(["daysSinceQuestionnaire"], fetchDaysSinceEntryQuestionnaire, {
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (!isProgressLoading && participantProgress) {
      if (!participantProgress.consent_completed) {
        router.push("/consent");
      } else if (!participantProgress.entry_survey_completed) {
        router.push("/entry");
      } else if (
        daysSinceEntryQuestionnaire > 28 &&
        !participantProgress.exit_survey_completed
      ) {
        router.push("/exit");
      }
    }
  }, [
    participantProgress,
    isProgressLoading,
    router,
    daysSinceEntryQuestionnaire,
  ]);

  if (isProgressLoading || isExercisesLoading || isDaysLoading)
    return <div>Loading...</div>;
  if (isProgressError || isExercisesError || isDaysError)
    return <div>Error: {error?.message}</div>;

  return (
    <div className="p-6 mt-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-stone-200 mb-8">
          Breathing calendar
        </h1>
        <div className="text-center mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-btn-background hover:bg-btn-background-hover text-white font-bold py-2 px-4 rounded"
          >
            Information
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <DayCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
      <InfoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default CalendarPage;
