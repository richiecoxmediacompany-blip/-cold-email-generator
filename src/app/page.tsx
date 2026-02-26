"use client";

import { useState, FormEvent } from "react";
import EmailResult from "./EmailResult";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [offering, setOffering] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetPersona, setTargetPersona] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedEmail("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          offering,
          targetCompany,
          targetPersona,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setGeneratedEmail(data.email);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate email";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cold Email Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate personalized cold emails in seconds with AI.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Your Company Name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="targetCompany"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Target Company Name
              </label>
              <input
                id="targetCompany"
                type="text"
                required
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g., TechStart Inc"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="offering"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              What You Sell / Offer
            </label>
            <textarea
              id="offering"
              required
              value={offering}
              onChange={(e) => setOffering(e.target.value)}
              placeholder="e.g., AI-powered customer support platform that reduces ticket resolution time by 60%"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="targetPersona"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Target Persona
            </label>
            <input
              id="targetPersona"
              type="text"
              required
              value={targetPersona}
              onChange={(e) => setTargetPersona(e.target.value)}
              placeholder="e.g., VP of Customer Success"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Email"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">
            {error}
          </div>
        )}

        {generatedEmail && <EmailResult email={generatedEmail} />}
      </div>
    </main>
  );
}
