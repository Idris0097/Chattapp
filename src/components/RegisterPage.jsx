import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../App.css";

const Register = ({ csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const payload = {
      username,
      password,
      email,
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Username is already in use!");
        }

        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        navigate("/login", {
          state: { message: "Great, you are now a member" },
        });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="w-full max-w-md bg-white bg-opacity-60 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-light text-center mb-8 text-white tracking-wide">
          Registera dig här
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <p className="text-green-500 text-center mb-4">
          Redan medlem?{" "}
          <NavLink to="/login" className="text-blue-500 underline">
            Klicka här
          </NavLink>
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="login-namn:"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Lösen:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Mailadress:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            Registera dig
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
