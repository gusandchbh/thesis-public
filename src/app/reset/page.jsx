"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getSupabaseClient = () => createClientComponentClient();

export default function Reset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = getSupabaseClient();

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError("Failed to reset password");
      console.error("Error: ", error.message);
    } else {
      setMessage("Your password has been updated");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full px-4">
        <h1 className="text-xl font-semibold text-center mb-2">
          Set new password
        </h1>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            id="password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2"
          />

          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-btn-background text-white rounded-md hover:bg-btn-background-hover focus:outline-none "
          >
            Update password
          </button>
        </form>
        {error ? (
          <p className="mt-3 text-sm text-center font-medium text-red-500">
            {error}
          </p>
        ) : null}
        {message ? (
          <>
            <p className="mt-3 text-sm text-center font-medium">{message}</p>
            <a
              href="/login"
              className="mt-3 text-sm text-center font-medium hover:underline"
            >
              Return to login
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
