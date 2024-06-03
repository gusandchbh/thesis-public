import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { formatDate } from "../../utils/dates/dates";
import Link from "next/link";

const DayCard = ({ exercise }) => {
  const formattedDate = formatDate(new Date(exercise.date));
  const isDayCompleted = exercise.session_count === 2;
  const isMorningCompleted = exercise.session_count > 0;

  return (
    <div
      className={`border rounded shadow p-4 ${isDayCompleted ? "border-sky-500" : "border-sky-300"}`}
    >
      <div className="flex justify-center items-center mb-2 text-lg font-semibold">
        {formattedDate}
      </div>

      {isDayCompleted ? (
        <div className="text-center text-green-500">
          <IoCheckmarkCircleOutline className="text-xl mx-auto" />
          <p>Completed</p>
        </div>
      ) : (
        <div className="flex justify-between">
          <SessionButton
            sessionName="Morning"
            exerciseId={exercise.id}
            isCompleted={isMorningCompleted && exercise.session_count !== 2}
          />
          <SessionButton
            sessionName="Evening"
            exerciseId={exercise.id}
            isCompleted={false}
          />
        </div>
      )}
    </div>
  );
};

const SessionButton = ({ sessionName, exerciseId, isCompleted }) => (
  <Link href={`/exercise/${exerciseId}`}>
    <button className="flex flex-col items-center justify-center p-2 border rounded-lg bg-sky-800 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-300">
      <p className="text-sm font-medium text-stone-200">{sessionName}</p>
      <SessionIcon isCompleted={isCompleted} />
    </button>
  </Link>
);

const SessionIcon = ({ isCompleted }) =>
  isCompleted ? (
    <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
  ) : null;

export default DayCard;
