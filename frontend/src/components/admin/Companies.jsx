import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TableCompanies from "./TableCompanies.jsx"; // Assuming this is in the same directory
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice.js";
import { PlusCircle, Search } from "lucide-react"; // Import new icons

const Companies = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetAllCompanies(); // Fetches all companies

  useEffect(() => {
    // Debounce the input for better performance on search
    const handler = setTimeout(() => {
      dispatch(setSearchCompanyByText(input));
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [input, dispatch]); // Added dispatch to dependencies

  // Access the companies from the Redux store (though not directly used here, good to keep)
  // const {companies} = useSelector(store=>store.company); 

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-9 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Search companies by name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* New Company Button */}
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out w-full sm:w-auto"
            onClick={() => navigate("/admin/companies/create")}
          >
            <PlusCircle className="h-5 w-5" />
            Add New Company
          </Button>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TableCompanies />
        </div>
      </div>
    </div>
  );
};

export default Companies;