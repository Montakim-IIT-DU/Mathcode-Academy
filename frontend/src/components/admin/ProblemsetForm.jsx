import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

function ProblemsetForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    visibility: "public"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Problemset form is ready. Backend API can be connected later.");
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ color: "#7c3aed", marginBottom: "16px" }}>Create Problemset</h2>

      <Input
        label="Problemset Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Enter problemset title"
      />

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

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: "8px" }}>
          Visibility
        </label>
        <select
          name="visibility"
          value={form.visibility}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #dbe2f0",
            background: "#f9fbff"
          }}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <Button type="submit">Save Problemset</Button>

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

export default ProblemsetForm;