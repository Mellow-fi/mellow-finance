import React, { useState } from "react";
import { auth } from "./firebase"; // Ensure this path is correct
import { sendSignInLinkToEmail } from "firebase/auth";
import image from "../static/login-image.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = async () => {
    const actionCodeSettings = {
      url: 'http://localhost:3000/pool-list', 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage(`Check your email for the login link!`);
      // Save the email locally to complete the sign-in later
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error : any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-3xl font-semibold mb-4 text-gray-800 flex items-center">
        <h1>Mellow M<span className="text-yellow-400 mx-1">o</span>ney Magic!</h1> 
      </div>

      <div>
        <img src="../static/login-image.png" alt="Cat Image" />
      </div>

      <div>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={handleEmailChange}
          className="border rounded p-2"
        />
      </div>

      <div>
        <button 
          onClick={handleLogin}
          className="px-7 py-2 bg-yellow-400 text-white rounded-full shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          Send Login Link
        </button>
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default Login;
