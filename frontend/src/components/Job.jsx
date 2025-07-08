import { Bookmark, BookmarkCheck, MapPin, DollarSign, Clock, Users, Briefcase } from 'lucide-react'; // Added more icons
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false); // Local state for bookmark

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "N/A";
        const createdAt = new Date(mongodbTime);
        const currDate = new Date();
        const dateDiffMillis = currDate - createdAt;

        const seconds = Math.floor(dateDiffMillis / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(days / 365.25);

        if (days === 0) {
            return "Today";
        } else if (days === 1) {
            return "1 day ago";
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (months === 1) {
            return "1 month ago";
        } else if (months < 12) {
            return `${months} months ago`;
        } else if (years === 1) {
            return "1 year ago";
        } else {
            return `${years} years ago`;
        }
    };

    const handleBookmarkToggle = () => {
        setIsBookmarked(prev => !prev);
        // In a real application, make an API call here to save/unsave the job
        // toast.success(isBookmarked ? "Job unsaved!" : "Job saved!");
    };

    // Determine badge colors for better visual distinction
    const getBadgeColor = (type) => {
        switch (type) {
            case 'jobType': return { bg: "bg-purple-100", text: "text-purple-700", icon: <Clock size={14} className="mr-1" /> };
            case 'salary': return { bg: "bg-emerald-100", text: "text-emerald-700", icon: <DollarSign size={14} className="mr-1" /> };
            case 'position': return { bg: "bg-sky-100", text: "text-sky-700", icon: <Users size={14} className="mr-1" /> };
            default: return { bg: "bg-gray-100", text: "text-gray-700" };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group"
             onClick={() => navigate(`/description/${job._id}`)}> {/* Make the whole card clickable */}
            {/* Top Row: Posted time and Bookmark button */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <p className="font-medium text-gray-600 flex items-center gap-1">
                    <Clock size={14} className="text-blue-400" />
                    Posted {daysAgoFunction(job?.createdAt)}
                </p>
                <Button
                    className="rounded-full transition-colors duration-200 group-hover:bg-blue-50"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(); }} // Stop propagation to prevent card click
                    aria-label={isBookmarked ? "Remove from saved jobs" : "Save job"}
                >
                    {isBookmarked ? (
                        <BookmarkCheck className="text-blue-600 fill-blue-600" />
                    ) : (
                        <Bookmark className="text-gray-500 group-hover:text-blue-500" />
                    )}
                </Button>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-4 my-3">
                <Avatar className="w-16 h-16 ring-2 ring-blue-200 shadow-sm flex-shrink-0"> {/* Larger avatar, added ring and shadow */}
                    <AvatarImage src={job?.company?.logo} alt={`${job?.company?.name} logo`} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                        {job?.company?.name?.[0]?.toUpperCase() || "C"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-extrabold text-2xl text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-200">{job?.company?.name}</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" /> {job?.location}
                    </p>
                </div>
            </div>

            {/* Job Title & Description */}
            <div className="mb-4 flex-grow">
                <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    <Briefcase size={18} className="inline-block mr-2 text-blue-500" />
                    {job?.title}
                </h3>
                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {job?.description}
                </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5 mt-auto"> {/* mt-auto pushes badges to bottom */}
                <Badge className={`${getBadgeColor('position').bg} ${getBadgeColor('position').text} px-3 py-1 text-sm rounded-full font-semibold flex items-center`}>
                    {getBadgeColor('position').icon} {job?.position} Positions
                </Badge>
                <Badge className={`${getBadgeColor('jobType').bg} ${getBadgeColor('jobType').text} px-3 py-1 text-sm rounded-full font-semibold flex items-center`}>
                    {getBadgeColor('jobType').icon} {job?.jobType}
                </Badge>
                <Badge className={`${getBadgeColor('salary').bg} ${getBadgeColor('salary').text} px-3 py-1 text-sm rounded-full font-semibold flex items-center`}>
                    {getBadgeColor('salary').icon} ₹{job?.salary} LPA
                </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    className="flex-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all duration-200 text-base py-2.5"
                    onClick={(e) => { e.stopPropagation(); navigate(`/description/${job._id}`); }} // Stop propagation
                >
                    View Details
                </Button>
                <Button
                    className={`flex-1 rounded-lg ${isBookmarked ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white shadow-md transition-all duration-200 text-base py-2.5`}
                    onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(); }} // Stop propagation
                    aria-label={isBookmarked ? "Remove from saved jobs" : "Save job for later"}
                >
                    {isBookmarked ? "Saved" : "Save Job"}
                </Button>
            </div>
        </div>
    );
};

export default Job;