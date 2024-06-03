"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SurveyForm from "./SurveyForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getSupabaseClient = () => createClientComponentClient();

export const Questionnaire = ({ surveyData: surveys }) => {
  const supabase = getSupabaseClient();
  const [excluded, setExcluded] = useState(false);
  const queryClient = useQueryClient();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(true);

  const initialValues = surveys?.sections.reduce((acc, section) => {
    section.questions.forEach((question) => {
      acc[question.id] = "";
    });
    return acc;
  }, {});

  const { mutate } = useMutation(
    async (submissionData) => {
      const { data, error } = await supabase
        .from("survey_responses")
        .insert(submissionData);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    {
      onSuccess: async () => {
        const userId = (await supabase.auth.getSession()).data.session.user.id;
        if (!userId) throw new Error("User not found");

        const updateField =
          surveys.type === "entry"
            ? { entry_survey_completed: true }
            : { exit_survey_completed: true };

        const { error } = await supabase
          .from("participant_progress")
          .update(updateField)
          .eq("user_id", userId);

        if (error) {
          throw new Error(error.message);
        }

        queryClient.setQueryData(["participantProgress"], (oldData) => {
          return { ...oldData, ...updateField };
        });
      },

      onError: (error) => {
        console.error("Submission error:", error);
      },
    },
  );
  const handleSubmit = async (values, { setSubmitting }) => {
    const allFilled = Object.values(values).every((x) => x !== "");
    setAllFieldsFilled(allFilled);
    setSubmitAttempted(true);

    const isExcluded = values.D1 === "0" || values.D2 === "1";
    setExcluded(isExcluded);

    if (!allFilled || isExcluded) {
      setSubmitting(false);
      return;
    }

    const user_id = (await supabase.auth.getSession()).data.session.user.id;

    const submissionData = Object.entries(values).map(
      ([question_id, response]) => ({
        user_id,
        survey_type: surveys.type,
        response_date: new Date().toISOString(),
        question_id,
        response,
      }),
    );

    mutate(submissionData);
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form className="w-full px-4">
          <div
            className="max-w-4xl mx-auto overflow-auto"
            style={{ maxHeight: "80vh" }}
          >
            {surveys?.sections.map((section, index) => (
              <div key={index} className="survey-section mb-2 p-4">
                <p className="mb-6">{section.instructions}</p>
                <SurveyForm questions={section.questions} />
              </div>
            ))}
            <div className="flex flex-col items-center mt-2 pb-4">
              {submitAttempted && !allFieldsFilled && (
                <div className="text-red-500 text-center mb-2">
                  Please answer everything before submitting.
                </div>
              )}
              {excluded && (
                <div className="text-red-500 text-center m-2">
                  Unfortunately, based on your response to question 1 or 2, you
                  are not eligible for participation in this intervention.
                </div>
              )}
              <button
                type="submit"
                disabled={excluded}
                className="w-full px-4 py-2 bg-btn-background text-white rounded-md hover:bg-btn-background-hover focus:outline-none "
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
