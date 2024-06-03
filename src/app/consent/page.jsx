"use client";
import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { fetchParticipantProgress } from "../api/Progress";
const InformedConsent = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  const {
    data: participantProgress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useQuery(["participantProgress"], fetchParticipantProgress, {
    staleTime: Infinity,
  });

  const { mutate: updateConsentStatus } = useMutation(
    async (consentGiven) => {
      const user = (await supabase.auth.getSession()).data.session.user;
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("participant_progress")
        .update({ consent_completed: consentGiven })
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(["participantProgress"], (oldData) => {
          return { ...oldData, consent_completed: true };
        });
        setConsentGiven(true);
        router.push("/entry");
      },
      onError: (error) => {
        console.error("Failed to update consent status:", error.message);
      },
    },
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isChecked) {
      await updateConsentStatus(true);
    }
  };

  if (isProgressLoading) {
    return <div></div>;
  }

  if (participantProgress.consent_completed && consentGiven) {
    <div></div>;
  } else if (participantProgress.consent_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 max-w-4xl w-full bg-white rounded-lg border border-gray-200 shadow-md">
          <p className="text-lg text-gray-900">
            Your informed consent has been saved.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/calendar"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Click here to go to the breathing calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 mt-4 max-w-4xl w-full bg-white rounded-lg ">
        <h5 className="text-2xl font-bold mb-6 text-gray-900">
          INFORMED CONSENT FOR PARTICIPATION IN THE INTERVENTION
        </h5>
        <div className="text-gray-700 space-y-4">
          <p>
            <strong>PURPOSE OF THE STUDY</strong>
          </p>
          <p>
            <strong>STUDY PROCEDURES</strong>
            <p></p>
            <strong>VOLUNTARY PARTICIPATION</strong>
          </p>
          <p>
            <strong>CONTACT INFORMATION</strong>
          </p>
          <p>
            <strong>CONSENT</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-6">
            <label htmlFor="consentCheckbox" className="flex items-center">
              <input
                type="checkbox"
                id="consentCheckbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
              />

              <span className="ml-2 text-sm text-gray-600">
                By marking this checkbox, I confirm that I have read and
                understand this consent agreement and freely and voluntarily
                agree to participate in the intervention.
              </span>
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isChecked}
              className={`px-6 py-2 rounded text-white font-semibold ${isChecked ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InformedConsent;
