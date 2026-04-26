function ProblemStatement({ problem }) {
  if (!problem) {
    return (
      <div className="card">
        <p>Problem not found.</p>
      </div>
    );
  }

  const tags = String(problem.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="card">
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span className="badge badge-primary">{problem.code}</span>
        <span className="badge badge-warning">{problem.difficulty}</span>
        <span className="badge badge-primary">Topic: {problem.topic || "General"}</span>
        <span className="badge badge-primary">Time: {problem.time_limit}s</span>
        <span className="badge badge-primary">Memory: {problem.memory_limit}MB</span>
      </div>

      <h2 style={{ color: "#4f46e5", marginBottom: "14px" }}>{problem.title}</h2>

      <div style={{ lineHeight: "1.9", color: "#374151", whiteSpace: "pre-wrap" }}>
        {problem.statement}
      </div>

      {tags.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px", color: "#7c3aed" }}>Tags</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {tags.map((tag, index) => (
              <span key={index} className="badge badge-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemStatement;
