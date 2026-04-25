import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { loginUser } from "../../api/authApi";
import { setToken, setUser } from "../../utils/storage";
import { validateLoginForm } from "../../utils/validators";

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const data = await loginUser(form);
      setToken(data.access_token);
      setUser(data.user);
      setMessage("Login successful");
      window.location.href = "/";
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "10px", color: "#4f46e5", fontSize: "28px" }}>Welcome Back</h2>
      <p style={{ marginBottom: "18px", color: "#6b7280" }}>
        Login to continue your coding journey.
      </p>

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter email"
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter password"
        error={errors.password}
      />

      <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>
        Login
      </Button>

      {message && (
        <p style={{ marginTop: "14px", color: "#4b5563", fontWeight: "600" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default LoginForm;