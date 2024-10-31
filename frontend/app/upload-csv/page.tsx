"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [errorDetails, setErrorDetails] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setLoading(true); // Set loading to true when upload starts
    setMessage(""); // Clear any previous messages
    setErrorDetails(""); // Clear any previous error details

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json(); // Expecting a JSON response from the backend
        setMessage(result.message || "Upload complete!");
        setLoading(false);

        // Delay before redirecting to allow the user to see the message
        setTimeout(() => {
          router.push("/questions");
        }, 2000);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        setMessage("Error uploading file.");
        setErrorDetails(errorData.error || "Unknown error occurred.");
        setLoading(false);
      }
    } catch (error) {
      setMessage("Error uploading file.");
      setErrorDetails(`Network error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Questions CSV</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <button
        onClick={handleUpload}
        className={`bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
      {errorDetails && <p className="mt-2 text-red-500">{errorDetails}</p>}
    </div>
  );
}
