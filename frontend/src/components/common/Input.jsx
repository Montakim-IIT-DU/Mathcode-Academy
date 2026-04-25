function Input({ label, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
      {label && (
        <label style={{ fontWeight: "700", color: "#374151" }}>
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          padding: "12px 14px",
          borderRadius: "14px",
          border: error ? "1px solid #ef4444" : "1px solid #dbe2f0",
          background: "#f9fbff",
          outline: "none"
        }}
      />

      {error && (
        <span style={{ color: "#ef4444", fontSize: "13px" }}>{error}</span>
      )}
    </div>
  );
}

export default Input;