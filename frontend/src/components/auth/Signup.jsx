import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constants";
import { toast } from "sonner";
import axios from 'axios';
import { useSelector } from "react-redux";
import { Loader2 } from 'lucide-react'; // Using Loader2 from lucide-react for a better spinner

const Signup = () => {
  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!input.fullName || !input.email || !input.phoneNumber || !input.password || !input.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Profile picture is now mandatory for both roles
    if (!input.file) {
      toast.error("Please upload a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("file", input.file); // File is always appended now

    try {
      // Assuming you have a setLoading action in your authSlice
      // dispatch(setLoading(true)); // Uncomment if you have this in your authSlice

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      // dispatch(setLoading(false)); // Uncomment if you have this in your authSlice
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <form
          className="w-full max-w-lg bg-white rounded-xl p-10 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]"
          onSubmit={submitHandler}
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Create Your Account</h1>

          {/* Full Name */}
          <div className="mb-6">
            <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={input.fullName}
              name="fullName"
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="e.g., 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
            <Input
              id="password"
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Register As:</Label>
            <div className="flex gap-8 justify-center">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  onChange={changeEventHandler}
                  checked={input.role === "student"}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <Label htmlFor="student" className="text-gray-800 text-md cursor-pointer">Student</Label>
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

          {/* Profile Upload (Now mandatory for both roles) */}
          <div className="mb-6">
            <Label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-2">Upload Profile Picture</Label> {/* Removed "(Optional)" */}
            <Input
              id="profilePic"
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
            />
            {input.file && (
              <p className="text-sm text-gray-500 mt-2">Selected file: {input.file.name}</p>
            )}
          </div>

          {/* Loader and Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Link to login */}
          <p className="text-center mt-6 text-base text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;