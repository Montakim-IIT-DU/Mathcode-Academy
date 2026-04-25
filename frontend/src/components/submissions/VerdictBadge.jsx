function getVerdictStyles(verdict) {
  switch (verdict) {
    case "Accepted":
      return {
        background: "#dcfce7",
        color: "#15803d"
      };
    case "Wrong Answer":
      return {
        background: "#fee2e2",
        color: "#dc2626"
      };
    case "Pending":
      return {
        background: "#fef3c7",
        color: "#d97706"
      };
    case "Compilation Error":
      return {
        background: "#ede9fe",
        color: "#7c3aed"
      };
    case "Runtime Error":
      return {
        background: "#ffedd5",
        color: "#ea580c"
      };
    case "Time Limit Exceeded":
      return {
        background: "#dbeafe",
        color: "#2563eb"
      };
    default:
      return {
        background: "#e5e7eb",
        color: "#4b5563"
      };
  }
}

function VerdictBadge({ verdict }) {
  const styles = getVerdictStyles(verdict);

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "800",
        background: styles.background,
        color: styles.color
      }}
    >
      {verdict}
    </span>
  );
}

export default VerdictBadge;