import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";  // ✅ added
import Navbar from "./Navbar";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedCode = localStorage.getItem("revivr_code");
    const savedLang = localStorage.getItem("revivr_lang");
    const savedReview = localStorage.getItem("revivr_review");

    if (savedCode) setCode(savedCode);
    if (savedLang) setLanguage(savedLang);
    if (savedReview) setReview(savedReview);
  }, []);

  // Save everything to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("revivr_code", code);
    localStorage.setItem("revivr_lang", language);
    localStorage.setItem("revivr_review", review);
  }, [code, language, review]);

  // Handle review request
  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please add some code first.");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();
      setReview(json.review || "No feedback received.");
    } catch (error) {
      console.error("Network Error:", error);
      setReview("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleClearReview = () => {
    setCode("");
    setReview("");
    localStorage.removeItem("revivr_code");
    localStorage.removeItem("revivr_review");
  };

  return (
    <>
      <Navbar onClearReview={handleClearReview} />

      <div className="pt-16 flex flex-col lg:flex-row w-full min-h-screen bg-[#0a192f] text-white">
        {/* Left side: Code editor */}
        <div className="flex-1 border-r border-cyan-900 relative">
          <div className="absolute top-3 right-5 z-10">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0f2027] border border-cyan-700 text-white text-sm px-3 py-1 rounded-md"
            >
              <option value="javascript">JavaScript</option>
              <option value="jsx">React (JSX)</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          <Editor
            height="calc(100vh - 180px)"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              fontSize: 14,
            }}
          />

          <div className="flex justify-center my-4">
            <button
              onClick={handleReview}
              disabled={loading}
              className={`px-5 py-2 font-semibold rounded-lg ${
                loading
                  ? "bg-cyan-800 text-gray-400"
                  : "bg-cyan-500 hover:bg-cyan-400 text-[#022]"
              }`}
            >
              {loading ? "Analyzing..." : "Review Code"}
            </button>
          </div>
        </div>

        {/* Right side: AI Review */}
        <div
          className="flex-1 p-4 lg:p-6 overflow-auto bg-[#0f2130] border-l border-cyan-900"
          style={{ minHeight: "75vh" }}
        >
          <h3 className="text-cyan-400 font-semibold mb-3 text-lg">AI Review</h3>
          <div
            className="bg-[#0b1a25] border border-cyan-900 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap markdown-body"
            style={{ minHeight: "65vh" }}
          >
            {review ? (
              <ReactMarkdown>{review}</ReactMarkdown>  
            ) : (
              <p className="text-gray-500 italic">
                Write some code and click “Review Code” to see the AI’s feedback.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
