import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../Context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function NavBar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(
    AppContent
  );

  const sendVarificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
if (response.data.success) {
  navigate('/email-verify')
  toast.success(response.data.message)
}else{
  toast.error(response.data.message)
}
    } catch (error) {
      toast.error(error.message)
    }
  }
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      response.data.success && setIsLoggedin(false);
      response.data.success && setUserData(false);
      navigate("/");
      if (response.data.success) {
      }
      // Update your app state to reflect the logged-out state
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full p-10 ">
            <ul className="list-none whitespace-nowrap m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVarificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                Log Out
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
}

export default NavBar;