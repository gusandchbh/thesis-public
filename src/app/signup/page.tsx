import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const populateExercisesForUser = async (supabase: any, userId: any) => {
  const { error: progressError } = await supabase
    .from("participant_progress")
    .insert([
      {
        user_id: userId,
        consent_completed: false,
        entry_survey_completed: false,
        exit_survey_completed: false,
      },
    ]);

  if (progressError) {
    console.error("Error creating participant progress:", progressError);
    throw new Error(progressError.message);
  }
  let programStartDate = new Date();

  let programEndDate = new Date();
  programEndDate.setDate(programEndDate.getDate() + 28);

  let exercises = [];

  for (
    let date = new Date(programStartDate);
    date < programEndDate;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    exercises.push({
      user_id: userId,
      date: date.toISOString().split("T")[0],
      session_count: 0,
    });
  }

  const { error: exercisesError } = await supabase
    .from("exercises")
    .insert(exercises);

  if (exercisesError) {
    console.error("Error populating exercises:", exercisesError);
  }
};
export default function SignUp() {
  const signUp = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    let { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return redirect("/login?message=Could not sign up");
    }

    // @ts-ignore
    const userUuid = (await supabase.auth.getSession()).data.session.user.id;

    if (userUuid) {
      populateExercisesForUser(supabase, userUuid).catch((err) => {
        console.error("Error populating exercises:", err);
      });
    }

    return redirect("/calendar");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="absolute top-3 left-3 z-10">
        <Link
          href="/"
          className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
      </div>
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signUp}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          formAction={signUp}
          className="rounded-md px-4 py-2 text-foreground mb-2 bg-sky-500 hover:bg-sky-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
