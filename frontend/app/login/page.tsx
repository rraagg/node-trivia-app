"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const { setIsAuthenticated } = useAuth(); // Access AuthContext
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true); // Update global auth state
        router.push("/");
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.error || "Login failed", type: "error" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
          Login
        </button>
        {message.text && (
          <p className={`mt-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

