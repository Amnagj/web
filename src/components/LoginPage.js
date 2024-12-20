import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import emailjs from 'emailjs-com';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [name, setName] = useState(""); // For login and signup
  const [mail, setMail] = useState(""); // For signup
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store error messages
  const [nameError, setNameError] = useState(""); // Error for name validation
  const [passwordError, setPasswordError] = useState(""); // Error for password validation
  const [verificationCode, setVerificationCode] = useState(""); // Code généré
  const [isCodeSent, setIsCodeSent] = useState(false); // Pour afficher la vérification
  const [generatedCode, setGeneratedCode] = useState(""); // Stocke le code envoyé par e-mail

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Code à 6 chiffres
  };

  const validateName = (name) => {
    const hasNumbers = /\d/; // Check for numbers
    if (hasNumbers.test(name)) {
      return "Name should not contain numbers.";
    }
    if (name.length < 3) {
      return "Name should be at least 3 characters long.";
    }
    return "";
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/; // At least one uppercase letter
    const hasLowercase = /[a-z]/; // At least one lowercase letter
    const hasNumber = /\d/; // At least one digit
    const hasSpecialChar = /[@$!%*?&]/; // At least one special character
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowercase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character (e.g., @$!%*?&).";
    }
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { name, password });
      alert("Login successful!");
      const { isAdmin, token } = response.data;
  
      // Store token for authentication
      localStorage.setItem("token", token);
  
      // Redirect user based on role
      if (isAdmin) {
        window.location.href = "/adminpanel";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    // Génération du code de vérification
    const code = generateCode();
    setGeneratedCode(code);
    setVerificationCode(""); // Clear the verification input field

    // Validation
    const nameValidationError = validateName(name);
    const passwordValidationError = validatePassword(password);
    if (nameValidationError || passwordValidationError) {
      setNameError(nameValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      await axios.post("/auth/register", { name, mail, password });
      alert("Account created successfully!");
      setIsCodeSent(true); // Show the verification form after signup

      const templateParams = {
        name: name, // User's name
        to_email: mail, // User's email
        verification_code: code, // Replace with your verification link
      };

      emailjs
        .send("service_a2pxinv", "template_4mp49ha", templateParams, "JTKLPSKurLIfVlKKZ")
        .then(
          (response) => {
            console.log("Email sent successfully:", response.status, response.text);
            alert("A verification code has been sent to your email.");
          },
          (error) => {
            console.error("Failed to send email:", error);
            alert("Failed to send the verification code. Please try again.");
          }
        );
    } catch (err) {
      setError(err.response?.data?.message || "Error creating account");
    }
  };

  const handleVerification = (e) => {
    e.preventDefault();
    if (verificationCode === generatedCode) {
      alert("Account verified successfully!");
      setIsLogin(true); // Return to the login page after successful verification
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {isLogin ? (
          <>
            <h2>Login to Your Account</h2>
            {error && <p style={{ fontSize: "0.75rem", color: "#d9534f", marginTop: "5px" }}>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
            <p className="toggle-form">
              Don't have an account?{" "}
              <button type="button" className="link-button" onClick={() => setIsLogin(false)}>
                Create Account
              </button>
            </p>
          </>
        ) : isCodeSent ? (
          <>
            <h2>Email Verification</h2>
            {error && <p style={{ fontSize: "0.75rem", color: "#d9534f", marginTop: "5px" }}>{error}</p>}
            <form onSubmit={handleVerification}>
              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter the verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Verify
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Create a New Account</h2>
            {error && <p style={{ fontSize: "0.75rem", color: "#d9534f", marginTop: "5px" }}>{error}</p>}
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(validateName(e.target.value));
                  }}
                  required
                />
                {nameError && <p style={{ fontSize: "0.75rem", color: "#d9534f", marginTop: "5px" }}>{nameError}</p>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                  required
                />
                {passwordError && <p style={{ fontSize: "0.75rem", color: "#d9534f", marginTop: "5px" }}>{passwordError}</p>}
              </div>
              <button type="submit" className="login-button">
                Sign Up
              </button>
            </form>
            <p className="toggle-form">
              Already have an account?{" "}
              <button type="button" className="link-button" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
