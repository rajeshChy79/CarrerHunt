import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, MapPin, DollarSign, CalendarDays } from 'lucide-react'; // Import new icons

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    // Helper to format date if needed for 'posted days ago'
    const calculateDaysAgo = (dateString) => {
        if (!dateString) return 'N/A';
        const postedDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - postedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-7 cursor-pointer"
            onClick={() => navigate(`/description/${job._id}`)}
        >
            {/* Company Info */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{job?.company?.name}</h1>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{job?.location || 'Remote'}</span>
                    </div>
                </div>
                {/* Company Logo (if available) */}
                {job?.company?.logo && (
                    <img
                        src={job.company.logo}
                        alt={`${job.company.name} Logo`}
                        className="h-14 w-14 object-contain rounded-lg border border-gray-100 p-1"
                    />
                )}
            </div>

            {/* Job Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                {job?.title}
            </h2>

            {/* Job Description Snippet */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job?.description || 'No description provided.'}
            </p>

            {/* Key Attributes Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                {job?.jobType && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 font-medium px-3 py-1 rounded-full text-xs flex items-center">
                        <BriefcaseBusiness className="w-3.5 h-3.5 mr-1" /> {job?.jobType}
                    </Badge>
                )}
                {job?.salary && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium px-3 py-1 rounded-full text-xs flex items-center">
                        <DollarSign className="w-3.5 h-3.5 mr-1" /> {job?.salary} LPA
                    </Badge>
                )}
                 {job?.position && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 font-medium px-3 py-1 rounded-full text-xs flex items-center">
                        {job?.position} Positions
                    </Badge>
                )}
            </div>

            {/* Footer with Posted Date */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" /> Posted {calculateDaysAgo(job?.createdAt)}
                </span>
                {/* Potentially add 'Apply Now' button here if it navigates directly from the card */}
                {/* <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">View Details</Button> */}
            </div>
        </div>
    );
};

export default LatestJobCards;