import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../Context/AppContext";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setisOtpSubmitted] = useState(false);
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

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        {
          email,
        }
      );
      if (data.success) {
        setIsEmailSent(true);

        toast.success(data.response.message);
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

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((input) => input.value);
    setOtp(otpArray.join(""));
    setisOtpSubmitted(true);
  };

  const onsubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-5 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {/* Enter  Email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center  mb-6 text-indigo-300">
            Enter your regestered email address{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className="w-3 h-3" alt="mail icon" />
            <input
              type="email"
              placeholder="Enter Email ID"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium 
                 hover:from-indigo-400 hover:to-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}

      {/* otp input form  */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password OTP
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
            Submit
          </button>
        </form>
      )}

      {/* Enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onsubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center  mb-6 text-indigo-300">
            Enter the new password bellow{" "}
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className="w-3 h-3" alt="mail icon" />
            <input
              type="password"
              placeholder="Enter new password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium 
                 hover:from-indigo-400 hover:to-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
