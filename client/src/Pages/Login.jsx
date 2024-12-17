import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin ,getUserData } = useContext(AppContent);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const onSubmitHandler = async (e) => {

  //   try {
  //     axios.defaults.withCredentials = true;
  //     e.preventDefault();
  //     if (state === "Sign Up") {
  //       const { data } = await axios.post(backendUrl + "/api/auth/register", {
  //         name,
  //         email,
  //         password,
  //       });
  //       console.log(data.success);
  
  //       if (data.success) {
  //         setIsLoggedin(false); // Set to false because the user is not logged in yet
  //         setState("Login");
  //         navigate("/"); 
  //         // Navigate to the login page
  //       }
  //     } else {
  
  //       const { data } = await axios.post(backendUrl + "/api/auth/login", {
  //         email,
  //         password,
  //       });
  
  
  //       if (data.success) {
  //         getUserData();  
  //         navigate("/");
  //       } else {
  //         toast.error(data.message); // only display error message if login fails
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const {data} = await axios.post(`${backendUrl}/api/auth/register`,{
          name, email, password
        })
        if (data.success) {
          getUserData()
          setIsLoggedin(false) // 
          setState("Login")
          navigate("/")
        }else{
          toast.error(data.response.message)
        }
      }else{
        const {data} = await axios.post(`${backendUrl}/api/auth/login`,{
      email, password
        })
        if (data.success) {
          getUserData()
         setIsLoggedin(true) 
         navigate("/")
        }else{
         toast.error(data.response.message)
         console.log(data)
       }

      }
    }catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
}

  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-5 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3 ">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-sm text-center mb-6">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to youe account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="bg-transparent outline-none"
                placeholder="Enter Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              placeholder="Enter Email Id"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              placeholder="Enter Password"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer hover:underline "
          >
            Forgot Password
          </p>
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium 
             hover:from-indigo-400 hover:to-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
         
          >{state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
              }}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
