function Modal({ title, children }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "12px" }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default Modal;