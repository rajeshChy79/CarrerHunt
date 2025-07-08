import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../redux/jobSlice'; // Adjust path if needed

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (query.trim()) {
      console.log("query",query.type)
      dispatch(setSearchQuery(query.trim()));
      navigate(`/jobs`);
      setQuery("");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8 my-10 max-w-4xl mx-auto text-center">
        <span className="mx-auto px-5 py-2.5 rounded-full bg-blue-100 text-blue-700 text-sm sm:text-base font-semibold shadow-sm animate-fade-in-down">
          #1 Job Hunt Platform
        </span>

        {/* Animated Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight animate-text-gradient bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent text-center">
          Join Top Companies
          <br className="hidden sm:inline" />
          and Advance Your Future
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto animate-slide-up-fade animation-delay-500">
          Discover thousands of opportunities from leading companies. Your next career move starts here.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex items-center justify-center w-full max-w-2xl mx-auto animate-fade-in-up animation-delay-1000">
          <div className="relative flex w-full border border-gray-300 rounded-full shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
            <Input
              type="text"
              placeholder="Search by job title, company, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
              className="w-full rounded-l-full border-none focus:ring-0 px-6 py-3 text-lg pr-14"
            />
            <Button
              type="submit"
              className="absolute right-0 top-0 h-full bg-blue-600 hover:bg-blue-700 text-white rounded-r-full px-6 py-3 flex items-center justify-center transition-colors duration-200"
              onClick={searchJobHandler}
              aria-label="Search jobs"
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tailwind Keyframes */}
<style>{`
  @keyframes blob {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9);
  }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }

  @keyframes fadeInDown {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-down {
    animation: fadeInDown 0.6s ease-out forwards;
    opacity: 0;
  }

  @keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up-fade {
    animation: slideUpFade 0.7s ease-out forwards;
    opacity: 0;
  }

  @keyframes fadeInScaleUp {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-up {
    animation: fadeInScaleUp 0.8s ease-out forwards;
    opacity: 0;
  }
  .animation-delay-500 { animation-delay: 0.5s; }
  .animation-delay-1000 { animation-delay: 1s; }

  @keyframes textGradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-text-gradient {
    background-size: 200% 200%;
    animation: textGradientShift 6s ease-in-out infinite;
  }
`}</style>

    </div>
  );
};

export default HeroSection;
