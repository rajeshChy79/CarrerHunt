import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../redux/jobSlice"; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';

// It's good practice to define categories outside the component if they are static
const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist", // Changed from Data Science for consistency with job roles
  "Graphic Designer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Cloud Engineer",
  "Mobile Developer",
  "Product Manager"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // The 'query' state is not needed here as the category is passed directly
  // const [query, setQuery] = useState("");

  const searchJobHandler = (categoryName) => { // Accept categoryName as argument
    if (categoryName && categoryName.trim()) { // Ensure categoryName is valid
      dispatch(setSearchQuery(categoryName.trim()));
      navigate(`/jobs`); // Navigating to /jobs for general job listings
      // No need to clear query state here as it's not managed
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">
        Browse by <span className="text-blue-600">Top Categories</span>
      </h2>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2"> {/* Adjusted margin for better spacing */}
          {categories.map((cat, index) => (
            <CarouselItem key={index} className="pl-2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"> {/* Adjusted basis and added padding */}
              <div className="p-1">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center h-12 rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out text-base font-semibold whitespace-nowrap px-6 py-3 shadow-sm hover:shadow-md"
                  onClick={() => searchJobHandler(cat)} // Pass the category directly
                >
                  {cat}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200 z-10" />
        <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200 z-10" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;