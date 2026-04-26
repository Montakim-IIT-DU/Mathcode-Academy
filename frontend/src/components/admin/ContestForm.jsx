import { useEffect, useState } from "react";
import { createContest } from "../../api/contestApi";
import { getProblems } from "../../api/problemApi";
import Button from "../common/Button";
import Input from "../common/Input";

const emptyForm = {
  title: "",
  description: "",
  contest_type: "Onsite",
  venue: "",
  start_time: "",
  end_time: "",
  status: "Upcoming",
  problem_ids: []
};

function ContestForm({ onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems for contest form", error);
      }
    };

    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProblemToggle = (problemId) => {
    setForm((prev) => {
      const isSelected = prev.problem_ids.includes(problemId);

      return {
        ...prev,
        problem_ids: isSelected
          ? prev.problem_ids.filter((id) => id !== problemId)
          : [...prev.problem_ids, problemId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdContest = await createContest({
        ...form,
        venue: form.contest_type === "Onsite" ? form.venue : "",
        problem_ids: form.problem_ids.map(Number)
      });
      onCreated?.(createdContest);
      setMessage("Contest created successfully");
      setForm(emptyForm);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to create contest");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ color: "#7c3aed", marginBottom: "16px" }}>Create Contest</h2>

      <Input label="Title" name="title" value={form.title} onChange={handleChange} />

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #dbe2f0",
            background: "#f9fbff"
          }}
        />
      </div>

      <div className="grid two-column">
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
            Contest Type
          </label>
          <select
            name="contest_type"
            value={form.contest_type}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid #dbe2f0",
              background: "#f9fbff"
            }}
          >
            <option value="Onsite">Onsite</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {form.contest_type === "Onsite" && (
          <Input
            label="Venue"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Lab 1, Main Campus"
          />
        )}
      </div>

      <div className="grid two-column">
        <Input
          label="Start Time"
          name="start_time"
          type="datetime-local"
          value={form.start_time}
          onChange={handleChange}
        />

        <Input
          label="End Time"
          name="end_time"
          type="datetime-local"
          value={form.end_time}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #dbe2f0",
            background: "#f9fbff"
          }}
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Running">Running</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "10px" }}>
          Problems
        </label>

        <div className="grid" style={{ maxHeight: "260px", overflowY: "auto" }}>
          {problems.length === 0 ? (
            <div className="empty-state" style={{ padding: "20px" }}>
              No problems available yet.
            </div>
          ) : (
            problems.map((problem) => (
              <label
                key={problem.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background: form.problem_ids.includes(problem.id) ? "#f5f3ff" : "#fff"
                }}
              >
                <input
                  type="checkbox"
                  checked={form.problem_ids.includes(problem.id)}
                  onChange={() => handleProblemToggle(problem.id)}
                  style={{ marginTop: "4px" }}
                />
                <span>
                  <strong>{problem.code}</strong> - {problem.title}
                  <span style={{ display: "block", color: "#6b7280", fontSize: "13px" }}>
                    {problem.topic || "General"} | {problem.difficulty}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <Button type="submit">Create Contest</Button>

      {message && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 14px",
            borderRadius: "14px",
            background: "#f5f3ff",
            color: "#7c3aed",
            fontWeight: "600"
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default ContestForm;
