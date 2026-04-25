import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { createProblem } from "../../api/problemApi";

function ProblemForm() {
  const [form, setForm] = useState({
    title: "",
    code: "",
    statement: "",
    difficulty: "Easy",
    time_limit: 1,
    memory_limit: 256,
    tags: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProblem({
        ...form,
        time_limit: Number(form.time_limit),
        memory_limit: Number(form.memory_limit)
      });
      setMessage("Problem created successfully");
      setForm({
        title: "",
        code: "",
        statement: "",
        difficulty: "Easy",
        time_limit: 1,
        memory_limit: 256,
        tags: ""
      });
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to create problem");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ color: "#4f46e5", marginBottom: "16px" }}>Create Problem</h2>

      <Input label="Title" name="title" value={form.title} onChange={handleChange} />
      <Input label="Code" name="code" value={form.code} onChange={handleChange} />

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
          Statement
        </label>
        <textarea
          name="statement"
          value={form.statement}
          onChange={handleChange}
          rows="6"
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
        <div>
          <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
            Difficulty
          </label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid #dbe2f0",
              background: "#f9fbff"
            }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <Input
          label="Tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="math, implementation"
        />
      </div>

      <div className="grid two-column">
        <Input
          label="Time Limit"
          name="time_limit"
          type="number"
          value={form.time_limit}
          onChange={handleChange}
        />
        <Input
          label="Memory Limit"
          name="memory_limit"
          type="number"
          value={form.memory_limit}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">Create Problem</Button>

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
    </form>
  );
}

export default ProblemForm;