import React, { useState } from "react";
import image from "../static/login-image.png" 
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = () => {
    console.log("I am logging in with: ", email)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        
      {/*header*/}
      <div className="text-3xl font-semibold mb-4-text-9ray-800 flex items-center">
        <h1>Mellow  M<span className="text-yellow-400 mx-1">o</span>ney Magic!</h1> 
      </div>

      {/*cat image*/}

      <div >
        <img
          src="../static/login-image.png"
          alt="Cat Image"
        />
      </div>

      {/*email input*/}

      <div>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      {/*login button*/}
      <div>
        <button onClick={handleLogin}
        className="px-7 py-2 bg-yellow-400 text-white rounded-full shadow-lg hover:bg-yellow-500 transition duration-300"
        >BUTTON</button>

      </div>

    </div>
  )
};

export default Login