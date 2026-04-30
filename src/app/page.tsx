"use client";

import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";

interface Feedback {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function Home() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const fetchFeedback = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbackList(data);
    } catch {
      toast.error("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Feedback submitted successfully!");
        setName("");
        setMessage("");
        fetchFeedback();
      } else {
        toast.error(data.error || "Failed to submit feedback");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedbackList
    .filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col">
      <div className="w-2/3 mx-auto flex-grow px-4 sm:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Feedback App
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Share your thoughts with us
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Message (10-200 characters)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              maxLength={200}
              rows={4}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your feedback (10-200 characters)"
            />
            <div className="text-right text-sm text-zinc-500 mt-1">
              {message.length}/200
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || message.length < 10 || message.length > 200}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback..."
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder("latest")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  sortOrder === "latest"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  sortOrder === "oldest"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                Oldest
              </button>
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">
              {searchQuery
                ? "No feedback matches your search"
                : "No feedback yet. Be the first!"}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {feedback.name}
                    </h3>
                    <span className="text-sm text-zinc-500">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {feedback.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 py-6 mt-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            &copy; 2026{" "}
            <a
              href="https://www.linkedin.com/in/rajat-kumar-87529321a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Rajat Kumar
            </a>
            . All rights reserved.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Permission required for commercial use. Contact: rajatarya080@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}