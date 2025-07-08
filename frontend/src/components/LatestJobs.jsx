import React from 'react';
import LatestJobCards from './LatestJobCards.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // Assuming Button component is available
import { ArrowRight } from 'lucide-react'; // Import icon for the button

const LatestJobs = () => {
    const navigate = useNavigate();
    const { allJobs } = useSelector((store) => store.job);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
            {/* Section Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-gray-900">
                Discover Your Next <span className="text-blue-600">Career Opportunity</span>
            </h1>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
                Explore the latest and most exciting job openings from top companies,
                tailored to kickstart or advance your career journey.
            </p>

            {/* Conditional Rendering for Job Cards or No Jobs Message */}
            {allJobs && allJobs.length > 0 ? (
                <>
                    {/* Job Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Slice to show only the first 6 jobs if more exist */}
                        {allJobs.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} /> // Use job._id for unique key
                        ))}
                    </div>
                    {/* View All Jobs Button */}
                    {allJobs.length > 6 && ( // Only show button if there are more than 6 jobs
                        <div className="text-center mt-16">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 mx-auto"
                                onClick={() => navigate('/jobs')} // Navigate to the full jobs listing page
                            >
                                View All Jobs
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                // No Jobs Available Message
                <div className="text-center py-20 bg-gray-50 rounded-lg shadow-inner border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-700 mb-4">No Job Openings Available Right Now</h2>
                    <p className="text-lg text-gray-500 max-w-md mx-auto">
                        We're constantly updating our listings. Please check back soon or explore other sections!
                    </p>
                    <Button
                        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all duration-200"
                        onClick={() => navigate('/')} // Or navigate to a different relevant page
                    >
                        Go to Homepage
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LatestJobs;