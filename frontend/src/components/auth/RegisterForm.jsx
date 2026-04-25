import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { registerUser } from "../../api/authApi";
import { setToken, setUser } from "../../utils/storage";
import { validateRegisterForm } from "../../utils/validators";

function RegisterForm() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
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

    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const data = await registerUser(form);
      setToken(data.access_token);
      setUser(data.user);
      setMessage("Registration successful");
      window.location.href = "/";
    } catch (error) {
      setMessage(error?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "10px", color: "#7c3aed", fontSize: "28px" }}>Create Account</h2>
      <p style={{ marginBottom: "18px", color: "#6b7280" }}>
        Join Mathcode Academy and start solving problems.
      </p>

      <Input
        label="Full Name"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="Enter full name"
        error={errors.full_name}
      />

      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Enter username"
        error={errors.username}
      />

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
        Register
      </Button>

      {message && (
        <p style={{ marginTop: "14px", color: "#4b5563", fontWeight: "600" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default RegisterForm;