function PerformanceGraph({ performance }) {
  const dateSummary = performance?.date_summary || [];
  const recentSolves = performance?.graph || [];
  const width = 720;
  const height = 260;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxSolved = Math.max(1, ...dateSummary.map((item) => item.cumulative_solved || 0));

  const points = dateSummary.map((item, index) => {
    const x =
      dateSummary.length === 1
        ? padding + chartWidth / 2
        : padding + (index / (dateSummary.length - 1)) * chartWidth;
    const y =
      padding + chartHeight - (item.cumulative_solved / maxSolved) * chartHeight;

    return {
      ...item,
      x,
      y
    };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="card" style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: "18px"
        }}
      >
        <div>
          <h2 style={{ color: "#4338ca", marginBottom: "8px" }}>Performance Graph</h2>
          <p style={{ color: "#6b7280", lineHeight: "1.7" }}>
            This graph shows date vs accepted problems solved.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#6b7280", fontWeight: "700" }}>Total Solved</p>
          <p style={{ color: "#4f46e5", fontSize: "30px", fontWeight: "800" }}>
            {performance?.total_solved || 0}
          </p>
        </div>
      </div>

      {dateSummary.length === 0 ? (
        <div className="empty-state" style={{ padding: "24px 12px" }}>
          No accepted solved problems yet.
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label="Date vs solved problems"
              style={{ width: "100%", minWidth: "520px", display: "block" }}
            >
              <line
                x1={padding}
                y1={height - padding}
                x2={width - padding}
                y2={height - padding}
                stroke="#dbe2f0"
                strokeWidth="2"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={height - padding}
                stroke="#dbe2f0"
                strokeWidth="2"
              />
              <text x={padding} y={padding - 12} fill="#6b7280" fontSize="13">
                {maxSolved} solved
              </text>
              <text x={padding} y={height - 10} fill="#6b7280" fontSize="13">
                0 solved
              </text>

              <polyline
                points={linePoints}
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((point) => (
                <g key={point.date}>
                  <circle cx={point.x} cy={point.y} r="7" fill="#8b5cf6" />
                  <title>
                    {point.date}: {point.solved} solved, {point.cumulative_solved} total
                  </title>
                </g>
              ))}
            </svg>
          </div>

          <div className="grid" style={{ marginTop: "18px" }}>
            {recentSolves.slice(-5).reverse().map((item) => (
              <div
                key={item.submission_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "14px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "12px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "#f8faff"
                }}
              >
                <div>
                  <strong style={{ color: "#374151" }}>{item.problem_title}</strong>
                  <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                    {item.solve_date} - {item.source}
                    {item.contest_title ? ` - ${item.contest_title}` : ""}
                  </p>
                </div>
                <span className="badge badge-success">
                  {item.solved_count} solved
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PerformanceGraph;
