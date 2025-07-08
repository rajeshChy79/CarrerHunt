import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchJobByText } from "../../redux/jobSlice.js";
import AdminJobsTable from "./AdminJobsTable.jsx"; // Assuming path is correct
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs.jsx"; // Assuming path is correct
import { PlusCircle, Search } from "lucide-react"; // Import new icons

const AdminJobs = () => {
    useGetAllAdminJobs(); // Fetches all admin jobs on component mount
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Debounce the search input for better performance
    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setSearchJobByText(input));
        }, 300); // Debounce for 300ms

        return () => {
            clearTimeout(handler);
        };
    }, [input, dispatch]);

    const { allAdminJobs } = useSelector(store => store.job); // Not directly used here, but good to know it's available.

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Manage Posted Jobs
                    </h1>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                        onClick={() => navigate("/admin/jobs/create")}
                    >
                        <PlusCircle className="h-5 w-5" />
                        Post New Job
                    </Button>
                </div>

                {/* Filter and Table Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                                placeholder="Filter jobs by title, company, or location..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                    </div>
                    <AdminJobsTable />
                </div>
            </div>
        </div>
    );
};

export default AdminJobs;