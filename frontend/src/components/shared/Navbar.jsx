import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { LogOut, User2, Briefcase, Building2 } from "lucide-react"; // Added new icons
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constants";
import { setUser } from "../../redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(
        err?.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white sticky top-0 z-50 shadow-md"> {/* Sticky header with a stronger shadow */}
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo/Name */}
        <Link to="/" className="flex items-center group">
          <h1 className="text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
            Job<span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">Hub</span> {/* Changed color to blue, consistent with other UIs */}
          </h1>
          {/* Optional: Add a subtle logo icon next to the text */}
          {/* <Briefcase size={24} className="ml-2 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" /> */}
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <ul className="hidden md:flex font-medium items-center gap-6 text-gray-700"> {/* Hide on small screens, show on md and up */}
            {user?.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                  >
                    <Building2 size={16} /> Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                  >
                    <Briefcase size={16} /> Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="cursor-pointer hover:text-blue-600 transition-colors duration-200"
                  >
                    All Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="cursor-pointer hover:text-blue-600 transition-colors duration-200"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* User Avatar/Auth Buttons */}
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-blue-500 ring-offset-2 hover:ring-blue-600 transition-all duration-200 shadow-md">
                  <AvatarImage src={user.profile?.profilePic} /> {/* Use optional chaining for profilePic */}
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {user.fullName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-3 bg-white shadow-xl rounded-lg border border-gray-100 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"> {/* Enhanced popover styling */}
                {/* User Info Section */}
                <div className="flex items-center gap-3 p-2 mb-3 border-b border-gray-100 pb-3">
                  <Avatar className="w-12 h-12"> {/* Larger avatar in popover */}
                    <AvatarImage src={user.profile?.profilePic} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                      {user.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <h4 className="font-semibold text-gray-800 truncate">{user.fullName}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user?.email || "Email not available"} {/* Show email or a default message */}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5 capitalize">
                      {user?.role || "Role not defined"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                  {user && user.role === "student" && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md py-2.5 px-3"
                      asChild
                    >
                      <Link to="/profile" className="flex items-center gap-2">
                        <User2 size={16} /> View Profile
                      </Link>
                    </Button>
                  )}
                  {user && user.role === "recruiter" && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md py-2.5 px-3"
                      asChild
                    >
                      <Link to="/postjob" className="flex items-center gap-2">
                        <Briefcase size={16} /> Post New Job
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md py-2.5 px-3 mt-1"
                    onClick={logoutHandler}
                  >
                    <LogOut size={16} /> Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="px-4 py-2 text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 shadow-md transition-all duration-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          {/* Mobile menu button (Hamburger icon) would go here */}
          <div className="md:hidden">
            {/* You'd typically add a mobile menu button (hamburger icon) here */}
            {/* <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;