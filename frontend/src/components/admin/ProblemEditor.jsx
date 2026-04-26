import { useEffect, useState } from "react";
import {
  createTestcase,
  deleteTestcase,
  getTestcasesByProblem,
  updateTestcase
} from "../../api/testcaseApi";
import { deleteProblem, updateProblem } from "../../api/problemApi";
import Button from "../common/Button";
import Input from "../common/Input";

const emptyTestcase = {
  input_data: "",
  expected_output: "",
  is_sample: false
};

function getInitialForm(problem) {
  return {
    title: problem?.title || "",
    code: problem?.code || "",
    statement: problem?.statement || "",
    difficulty: problem?.difficulty || "Easy",
    topic: problem?.topic || "General",
    time_limit: problem?.time_limit || 1,
    memory_limit: problem?.memory_limit || 256,
    tags: Array.isArray(problem?.tags) ? problem.tags.join(", ") : problem?.tags || ""
  };
}

function ProblemEditor({ problem, onCancel, onDeleted, onSaved }) {
  const [form, setForm] = useState(getInitialForm(problem));
  const [testcases, setTestcases] = useState([{ ...emptyTestcase }]);
  const [deletedTestcaseIds, setDeletedTestcaseIds] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblem = async () => {
      setLoading(true);
      setMessage("");
      setForm(getInitialForm(problem));
      setDeletedTestcaseIds([]);

      try {
        const data = await getTestcasesByProblem(problem.id);
        setTestcases(data.length > 0 ? data : [{ ...emptyTestcase }]);
      } catch (error) {
        setMessage("Failed to load testcases");
        setTestcases([{ ...emptyTestcase }]);
      } finally {
        setLoading(false);
      }
    };

    if (problem?.id) {
      loadProblem();
    }
  }, [problem]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTestcaseChange = (index, field, value) => {
    setTestcases((prev) =>
      prev.map((testcase, testcaseIndex) =>
        testcaseIndex === index
          ? {
              ...testcase,
              [field]: value
            }
          : testcase
      )
    );
  };

  const addTestcase = () => {
    setTestcases((prev) => [...prev, { ...emptyTestcase }]);
  };

  const removeTestcase = (index) => {
    setTestcases((prev) => {
      const testcase = prev[index];
      if (testcase?.id) {
        setDeletedTestcaseIds((ids) => [...ids, testcase.id]);
      }

      const next = prev.filter((_, testcaseIndex) => testcaseIndex !== index);
      return next.length > 0 ? next : [{ ...emptyTestcase }];
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validTestcases = testcases.filter((testcase) =>
      testcase.expected_output.trim()
    );

    if (validTestcases.length === 0) {
      setMessage("Add at least one testcase with expected output.");
      return;
    }

    try {
      const updatedProblem = await updateProblem(problem.id, {
        ...form,
        time_limit: Number(form.time_limit),
        memory_limit: Number(form.memory_limit)
      });

      await Promise.all(
        deletedTestcaseIds.map((testcaseId) => deleteTestcase(testcaseId))
      );

      await Promise.all(
        validTestcases.map((testcase) => {
          const payload = {
            input_data: testcase.input_data,
            expected_output: testcase.expected_output,
            is_sample: Boolean(testcase.is_sample)
          };

          if (testcase.id) {
            return updateTestcase(testcase.id, payload);
          }

          return createTestcase({
            ...payload,
            problem_id: problem.id
          });
        })
      );

      setMessage("Problem updated successfully");
      onSaved?.(updatedProblem);
      setDeletedTestcaseIds([]);
      const latestTestcases = await getTestcasesByProblem(problem.id);
      setTestcases(latestTestcases.length > 0 ? latestTestcases : [{ ...emptyTestcase }]);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to update problem");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete problem "${problem.title}" and all of its testcases?`
    );

    if (!confirmed) return;

    try {
      await deleteProblem(problem.id);
      onDeleted?.(problem.id);
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Failed to delete problem");
    }
  };

  if (loading) {
    return <div className="card">Loading problem editor...</div>;
  }

  return (
    <form className="card" onSubmit={handleSave}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}
      >
        <h2 style={{ color: "#4f46e5" }}>Edit Problem</h2>
        <button
          type="button"
          onClick={onCancel}
          style={{
            border: "1px solid #dbe2f0",
            borderRadius: "6px",
            padding: "8px 12px",
            background: "#fff",
            color: "#374151",
            fontWeight: "700"
          }}
        >
          Cancel
        </button>
      </div>

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
            borderRadius: "10px",
            border: "1px solid #dbe2f0",
            background: "#f9fbff"
          }}
        />
      </div>

      <div className="grid two-column">
        <Input
          label="Topic"
          name="topic"
          value={form.topic}
          onChange={handleChange}
        />

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
              borderRadius: "10px",
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

      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <label style={{ display: "block", fontWeight: "700" }}>Testcases</label>
          <button
            type="button"
            onClick={addTestcase}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "6px",
              padding: "8px 12px",
              background: "#eef2ff",
              color: "#4f46e5",
              fontWeight: "700"
            }}
          >
            Add Testcase
          </button>
        </div>

        <div className="grid">
          {testcases.map((testcase, index) => (
            <div
              key={testcase.id || index}
              style={{
                padding: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                background: "#ffffff"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "10px"
                }}
              >
                <strong>Testcase {index + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  style={{
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontWeight: "700"
                  }}
                >
                  Remove
                </button>
              </div>

              <div className="grid two-column">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "700",
                      marginBottom: "8px"
                    }}
                  >
                    Input
                  </label>
                  <textarea
                    value={testcase.input_data}
                    onChange={(e) =>
                      handleTestcaseChange(index, "input_data", e.target.value)
                    }
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #dbe2f0",
                      background: "#f9fbff"
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "700",
                      marginBottom: "8px"
                    }}
                  >
                    Expected Output
                  </label>
                  <textarea
                    value={testcase.expected_output}
                    onChange={(e) =>
                      handleTestcaseChange(index, "expected_output", e.target.value)
                    }
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #dbe2f0",
                      background: "#f9fbff"
                    }}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginTop: "10px",
                  color: "#4b5563",
                  fontWeight: "600"
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(testcase.is_sample)}
                  onChange={(e) =>
                    handleTestcaseChange(index, "is_sample", e.target.checked)
                  }
                />
                Sample testcase
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Button type="submit">Save Changes</Button>
        <Button
          type="button"
          onClick={handleDelete}
          style={{
            background: "#dc2626",
            boxShadow: "0 8px 20px rgba(220, 38, 38, 0.18)"
          }}
        >
          Delete Problem
        </Button>
      </div>

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

export default ProblemEditor;
