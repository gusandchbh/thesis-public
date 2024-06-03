import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getSupabaseClient = () => createClientComponentClient();

export const fetchExercises = async () => {
  const supabase = getSupabaseClient();
  const userUuid = (await supabase.auth.getSession()).data.session.user.id;

  const { data: exercisesData, error: exercisesError } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userUuid)
    .order("date", { ascending: true });

  if (exercisesError) throw new Error(exercisesError.message);
  return exercisesData;
};
export const completeSession = async (exerciseId) => {
  const supabase = getSupabaseClient();
  const sessionResponse = await supabase.auth.getSession();
  if (!sessionResponse.data || !sessionResponse.data.session) {
    throw new Error("Failed to retrieve user session.");
  }
  const userUuid = sessionResponse.data.session.user.id;

  let { data: session, error: fetchError } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userUuid)
    .eq("id", exerciseId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (session && session.session_count < 2) {
    const { error: updateError, data: updatedSession } = await supabase
      .from("exercises")
      .update({ session_count: session.session_count + 1 })
      .eq("id", exerciseId)
      .select();

    if (updatedSession.length === 0) throw new Error("No session updated.");

    if (updateError) throw new Error(updateError.message);

    if (updatedSession[0].session_count === 2) {
      let { data: progressData, error: progressFetchError } = await supabase
        .from("participant_progress")
        .select("days_completed")
        .eq("user_id", userUuid)
        .single();

      if (progressFetchError) {
        console.error("Error fetching progress:", progressFetchError);
        return;
      }

      const updatedDaysCompleted = progressData.days_completed + 1;

      const { error: progressError } = await supabase
        .from("participant_progress")
        .update({ days_completed: updatedDaysCompleted })
        .eq("user_id", userUuid);

      if (progressError) {
        console.error("Error updating session:", progressError.message);
      }
    }

    return updatedSession;
  } else {
    throw new Error("Session count already at maximum or session not found.");
  }
};
