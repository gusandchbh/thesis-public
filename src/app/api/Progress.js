import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getSupabaseClient = () => createClientComponentClient();

export const fetchParticipantProgress = async () => {
  const supabase = getSupabaseClient();
  const user = (await supabase.auth.getSession()).data.session.user;
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("participant_progress")
    .select(
      "consent_completed, entry_survey_completed, exit_survey_completed, days_completed",
    )
    .eq("user_id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const fetchDaysSinceEntryQuestionnaire = async () => {
  const supabase = getSupabaseClient();
  const user = (await supabase.auth.getSession()).data.session.user;

  if (!user) throw new Error("User not found");

  const surveyType = "entry";

  const { data, error } = await supabase
    .from("survey_responses")
    .select("response_date")
    .eq("user_id", user.id)
    .eq("survey_type", surveyType)
    .order("response_date", { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;

  if (data) {
    const responseDate = new Date(data.response_date);
    responseDate.setUTCHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const timeDifference = currentDate - responseDate;
    const daysSinceResponse = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysSinceResponse;
  }

  return null;
};
