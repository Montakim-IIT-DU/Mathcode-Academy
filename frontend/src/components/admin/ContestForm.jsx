import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { createContest } from "../../api/contestApi";

function ContestForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "Upcoming"
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
      await createContest(form);
      setMessage("Contest created successfully");
      setForm({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "Upcoming"
      });
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