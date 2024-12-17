import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { use } from "react";

function EmailVerify() {
  const { backendUrl, userData, getUserData, isLoggedin } = useContext(
    AppContent
  );
  const navigate = useNavigate();
  const inputRef = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
    const value = e.target.value;
    inputRef.current[index].value = value;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "")
      inputRef.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    const past = e.clipboardData.getData("text");
    const pastArray = past.split("");
    pastArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const handleSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otparray = inputRef.current.map((input) => input.value);
      const otp = otparray.join("");
      console.log(otp);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        {
          otp,
        }
      );

      if (data.success) {
        toast.success(data.response.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.response.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (isLoggedin) {
      isLoggedin && userData && userData.isAccountVerified && navigate("/");
    }
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-5 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={handleSubmitHandler}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center  mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email{" "}
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                className="  w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium 
             hover:from-indigo-400 hover:to-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;