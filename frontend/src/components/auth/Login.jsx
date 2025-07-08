import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Changed from Loader to Loader2 for a better spinner
import { USER_API_END_POINT } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]); // Added navigate to dependency array

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4"> {/* Adjusted min-height and added background */}
        <form
          className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]" // Enhanced styling
          onSubmit={submitHandler}
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Welcome Back!</h1> {/* Larger, bolder title */}

          {/* Email */}
          <div className="mb-6"> {/* Increased margin-bottom */}
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label> {/* More descriptive label */}
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" // Styled input
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-8"> {/* Increased margin-bottom */}
            <Label className="block text-sm font-medium text-gray-700 mb-2">Login As:</Label>
            <div className="flex gap-8 justify-center"> {/* Centered radio buttons */}
              <div className="flex items-center space-x-3"> {/* Increased space-x */}
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  onChange={changeEventHandler}
                  checked={input.role === "student"}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" // Larger radio buttons
                />
                <Label htmlFor="student" className="text-gray-800 text-md cursor-pointer">Student</Label> {/* Larger label */}
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="recruiter"
                  onChange={changeEventHandler}
                  checked={input.role === "recruiter"}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <Label htmlFor="recruiter" className="text-gray-800 text-md cursor-pointer">Recruiter</Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg" // Enhanced button styling
            disabled={loading} // Disable button when loading
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />} {/* Integrated spinner */}
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Link to signup */}
          <p className="text-center mt-6 text-base text-gray-600"> {/* Adjusted margin and text size */}
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"> {/* Stronger link style */}
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;