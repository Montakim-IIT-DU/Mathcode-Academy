import { useState } from "react";
import Button from "../common/Button";
import { createSubmission } from "../../api/submissionApi";
import { getUser } from "../../utils/storage";

function SubmitPanel({ problemId, sourceCode, setSourceCode, language, setLanguage }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const user = getUser();

    if (!user) {
      setMessage("Please login first to submit a solution.");
      return;
    }

    if (!sourceCode.trim()) {
      setMessage("Source code cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        user_id: user.id,
        problem_id: problemId,
        language,
        source_code: sourceCode
      };

      const data = await createSubmission(payload);
      setMessage(`Submission sent successfully. Verdict: ${data.verdict}`);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ color: "#8b5cf6", marginBottom: "12px" }}>Submit Solution</h3>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #dbe2f0",
            background: "#f9fbff"
          }}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} style={{ width: "100%" }}>
        {isSubmitting ? "Submitting..." : "Submit Code"}
      </Button>

      {message && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 14px",
            borderRadius: "14px",
            background: "#eef2ff",
            color: "#4338ca",
            fontWeight: "600"
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default SubmitPanel;