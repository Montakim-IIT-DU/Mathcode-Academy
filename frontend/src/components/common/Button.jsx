function Button({
  children,
  type = "button",
  onClick,
  style = {},
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        padding: "12px 18px",
        borderRadius: "999px",
        background: disabled
          ? "#c7d2fe"
          : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#ffffff",
        fontWeight: "700",
        boxShadow: "0 8px 20px rgba(99, 102, 241, 0.25)",
        transition: "all 0.25s ease",
        ...style
      }}
    >
      {children}
    </button>
  );
}

export default Button;