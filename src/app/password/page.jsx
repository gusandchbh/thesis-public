"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const getSupabaseClient = () => createClientComponentClient();

const Page = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://mindfulness-thesis.vercel.app/reset",
    });

    if (error) {
      setMessage("Error sending password reset email");
      console.error("Error: ", error.message);
    } else {
      setMessage("Please check your email for the password reset link");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="max-w-md w-full px-4">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Reset password
        </h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none "
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-btn-background text-white rounded-md hover:bg-btn-background-hover "
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default Page;
