import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For multiline text inputs
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'sonner'; // Assuming you use sonner for toasts
import { JOB_API_END_POINT } from "../../utils/constants";
import { Loader2 } from "lucide-react"; // For loading spinner icon

const PostJobs = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        company: "", // This will hold the company name from the selected company object
        location: "",
        salary: "", // Keeping as string for initial empty state, will be converted to number for API if needed
        jobType: "", // Renamed from 'type' for clarity and consistency with select
        experience: "", // For select component
        position: "", // Keeping as string for initial empty state, will be converted to number
        companyId: "", // To store the _id of the selected company
    });

    const [loading, setLoading] = useState(false);
    // Ensure `companies` is an array; default to empty array if undefined
    const { companies = [] } = useSelector((store) => store.company);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    };

    // Generic handler for Select components
    const handleSelectChange = (name, value) => {
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    // Specific handler for Company Select to update both company name and ID
    const handleCompanySelectChange = (companyId) => {
        const selectedCompany = companies.find((c) => c._id === companyId);
        if (selectedCompany) {
            setInput((prevInput) => ({
                ...prevInput,
                company: selectedCompany.name,
                companyId: selectedCompany._id,
            }));
        } else {
            // Reset company fields if no company is selected (e.g., initial state or if options change)
            setInput((prevInput) => ({
                ...prevInput,
                company: "",
                companyId: "",
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        // Basic client-side validation
        const { title, description, requirements, companyId, location, salary, jobType, experience, position } = input;
        if (!title || !description || !requirements || !companyId || !location || !salary || !jobType || !experience || !position) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // Prepare data for submission, converting numbers where necessary
        const dataToSubmit = {
            ...input,
            salary: Number(salary),
            position: Number(position),
        };

        try {
            const res = await axios.post(`${JOB_API_END_POINT}/post`, dataToSubmit, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Job posted successfully!");
                navigate("/admin/jobs"); // Redirect to jobs list on success
                // Optionally reset form after successful submission
                setInput({
                    title: "", description: "", requirements: "", company: "",
                    location: "", salary: "", jobType: "", experience: "",
                    position: "", companyId: "",
                });
            }
        } catch (error) {
            console.error("Error posting job:", error); // Log full error for debugging
            toast.error(
                error.response?.data?.message || "Failed to post job. Please try again."
            );
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-full min-h-screen py-8 px-4 bg-gray-50">
                <form
                    onSubmit={submitHandler}
                    className="p-8 max-w-4xl w-full bg-white border border-gray-200 shadow-xl rounded-lg space-y-7"
                >
                    <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Post a New Job</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {/* Job Title */}
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1 block">Job Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="e.g., Senior Software Engineer, Product Manager"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {/* Company Select */}
                        <div>
                            <Label htmlFor="companySelect" className="text-sm font-medium text-gray-700 mb-1 block">Select Company <span className="text-red-500">*</span></Label>
                            {companies && companies.length > 0 ? (
                                <Select
                                    onValueChange={handleCompanySelectChange}
                                    value={input.companyId}
                                    name="companyId"
                                    required
                                >
                                    <SelectTrigger id="companySelect" className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                        <SelectValue placeholder="Choose a company" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[9999] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="mt-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex flex-col items-start gap-2">
                                    <p className="font-semibold">No companies available.</p>
                                    <p className="text-sm">You need to add a company first before posting a job.</p>
                                    <Button
                                        variant="link"
                                        className="text-red-700 p-0 h-auto underline font-medium"
                                        onClick={() => navigate('/admin/add-company')} // Example route to add company
                                    >
                                        Add New Company
                                    </Button>
                                </div>
                            )}
                        </div>
                        {/* Location */}
                        <div>
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">Location <span className="text-red-500">*</span></Label>
                            <Input
                                id="location"
                                type="text"
                                placeholder="e.g., Remote, San Francisco, Bengaluru"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {/* Salary */}
                        <div>
                            <Label htmlFor="salary" className="text-sm font-medium text-gray-700 mb-1 block">Annual Salary (LPA) <span className="text-red-500">*</span></Label>
                            <Input
                                id="salary"
                                type="number"
                                placeholder="e.g., 12 (for 12 Lakhs Per Annum)"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                min="0" // Minimum salary can be 0 or higher
                                step="0.5" // Allow decimal for salary
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {/* Job Type */}
                        <div>
                            <Label htmlFor="jobType" className="text-sm font-medium text-gray-700 mb-1 block">Job Type <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={(value) => handleSelectChange("jobType", value)}
                                value={input.jobType}
                                name="jobType"
                                required
                            >
                                <SelectTrigger id="jobType" className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999] bg-white border border-gray-300 rounded-md shadow-lg">
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Temporary">Temporary</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Experience Level */}
                        <div>
                            <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-1 block">Experience Level <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={(value) => handleSelectChange("experience", value)}
                                value={input.experience}
                                name="experience"
                                required
                            >
                                <SelectTrigger id="experience" className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <SelectValue placeholder="Select required experience" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999] bg-white border border-gray-300 rounded-md shadow-lg">
                                    <SelectGroup>
                                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                                        <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                                        <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                                        <SelectItem value="5-7 Years">5-7 Years</SelectItem>
                                        <SelectItem value="7+ Years">7+ Years</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Number of Positions */}
                        <div>
                            <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-1 block">Number of Positions <span className="text-red-500">*</span></Label>
                            <Input
                                id="position"
                                type="number"
                                placeholder="e.g., 5"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                min="1" // Ensure at least 1 position
                                required
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Description (full width) */}
                    <div className="col-span-full">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">Job Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            placeholder="Provide a detailed description of the job role, responsibilities, and team. Be as specific as possible."
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            rows={6} // Increased rows for more space
                            required
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* Requirements (full width) */}
                    <div className="col-span-full">
                        <Label htmlFor="requirements" className="text-sm font-medium text-gray-700 mb-1 block">Key Requirements <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="requirements"
                            placeholder="List essential skills, qualifications, and experience required. Use bullet points or clear sentences for readability."
                            name="requirements"
                            value={input.requirements}
                            onChange={changeEventHandler}
                            rows={6} // Increased rows for more space
                            required
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold flex items-center justify-center gap-2"
                        disabled={loading || companies.length === 0} // Disable if loading or no companies
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Posting Job...
                            </>
                        ) : (
                            "Post New Job"
                        )}
                    </Button>
                    {companies.length === 0 && (
                        <p className="text-center text-gray-500 text-sm mt-3">
                            The "Post New Job" button is disabled because no companies are currently available to associate with the job.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJobs;