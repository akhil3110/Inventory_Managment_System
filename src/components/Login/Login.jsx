import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";


const Login = () => {
  
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [variant, setVariant] = useState("LOGIN");

  const [loginForm, setLoginForm] = useState({});

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    setLoader(false);
    setLoginForm({})
  },[])

  const handleLogin = async () => {
    setLoader(true);
    if (variant === "LOGIN") {
      const response = await axios.post(
        "https://inventrot-managment-system.onrender.com/api/user/login",
        loginForm
      ).catch(() => {
        setLoader(false);
        toast.error("Please Enter Valid Details!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      });
      await localStorage.setItem("token", response.data.token)
      if (response.data.status) {
        navigate("/home");
      }
    } else if (variant === "REGISTER") {
      const response = await axios
        .post("https://inventrot-managment-system.onrender.com/api/user/register", loginForm)
        .catch(() => {
          setLoader(false);
          toast.error("Please Enter Valid Credentials!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        });
        await localStorage.setItem("token", response.data.token);

        if(response.data.status){
          await  toast.success("Registered  Succesfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          navigate("/home")
        }
        setLoader(false);
    }
  };

  const togglePasword = () => {
    if(passwordType == "password"){
      setPasswordType("text")
    }
    else{
      setPasswordType("password")
    }
  }

  return (
    <>
    {loader &&(
     <div className=" h-screen bg-slate-300">
    <div className="absolute top-[40%] left-[48%]">
    <div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </div>
    </div>
    )
    }
      <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
      <div className=" w-[50%] max-sm:w-[85%] flex mx-auto  p-6 border-purple-950 border-4 rounded-lg mt-20 sm:mt-40 bg-slate-200">
        <div className=" container mx-auto p-2 mt-6 rounded-lg">
          <div className=" flex row  mt-4  gap-5 justify-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10 max-sm:w-8 max-sm:h-8  text-white p-2 bg-indigo-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="text-3xl font-semibold max-sm:text-sm ">
              Inventory Managment System
            </div>
          </div>
          <div>
            <form className="mt-4">
              {variant === "REGISTER" && (
                <div>
                  <label className="block mb-2 ">Company/Shop Name</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                    placeholder="Enter Company/Shop Name"
                    name="companyName"
                    value={loginForm.companyName || ""}
                  />
                </div>
              )}

              <label className="block mb-2">Email</label>
              <input
                onChange={handleChange}
                type="email"
                className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                placeholder="Enter Email"
                name="email"
                value={loginForm.email || ""}
              />

              <label className="block mb-2">Password</label>
              <input
                onChange={handleChange}
                type={passwordType}
                className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                placeholder="Enter Password"
                name="password"
                value={loginForm.password || ""}
              />
              <div className="flex items-center mb-4">
              <input id="default-checkbox" type="checkbox" onClick={togglePasword} value="showPassword" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900">Show Password</label>
              </div>
              <div className=" text-gray-600 text-sm">
                {variant === "REGISTER" ? (
                  <div>
                    Already A User ?{" "}
                    <span
                      className="text-purple-500 cursor-pointer"
                      onClick={() => setVariant("LOGIN")}
                    >
                      Login
                    </span>
                  </div>
                ) : (
                  <div>
                    New User ?{" "}
                    <span
                      className="text-purple-500 cursor-pointer"
                      onClick={() => setVariant("REGISTER")}
                    >
                      Register
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogin}
                type="button"
                className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
              >
                {variant === "REGISTER" ? "Register" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
