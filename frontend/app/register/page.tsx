"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (response.ok) {
        setMessage("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Redirect to login page after registration
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Registration failed");
      }
    } catch (error) {
      console.log(error)
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            placeholder="Enter your name"
            required
          />
        </div>
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
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Register
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

