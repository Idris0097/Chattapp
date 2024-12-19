import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, csrfToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Fel användaruppgifter, vänligen försök igen!");
      }

      const data = await response.json();
      const { token } = data;
      const decoded = decodeToken(token);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("username", decoded.user);
      localStorage.setItem("avatar", decoded.avatar);

      setToken(token);
      setUserId(decoded.id);
      setErrorMessage("");

      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message);
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed", e);
      return {};
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1 className="login-title">Logga in</h1>

        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="login-namn:"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="lösen:"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">
            Logga in
          </button>
        </form>

        <NavLink to="/">
          <button className="register-button">
            Registrerad? Annars skapa ett konto.
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
