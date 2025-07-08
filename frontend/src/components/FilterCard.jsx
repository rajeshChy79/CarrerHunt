import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../redux/jobSLice";

const filterData = [
  {
    filterType: "Location",
    options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    options: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    options: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const [selectedFilters, setSelectedFilters] = useState({}); // ✅ should be an object

  const handleChange = (filterType, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  useEffect(() => {
    // Combine all selected filter values into a single string (e.g., "Delhi NCR Backend Developer")
    const query = Object.values(selectedFilters).join(" ").trim();
    dispatch(setSearchQuery(query)); // ✅ send a string to Redux
  }, [selectedFilters]);

  return (
    <div className="bg-white p-4 rounded shadow-md w-64">
      <h1 className="text-lg font-semibold mb-4">Filter Jobs</h1>
      {filterData.map((section, idx) => (
        <div key={idx} className="mb-5">
          <h2 className="font-medium text-md mb-2">{section.filterType}</h2>
          <div className="space-y-2">
            {section.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={section.filterType}
                  value={option}
                  checked={selectedFilters[section.filterType] === option}
                  onChange={() => handleChange(section.filterType, option)}
                  className="form-radio text-black"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
