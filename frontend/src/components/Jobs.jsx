import React, { useEffect, useState } from 'react';
import FilterCard from './FilterCard';
import Job from './Job';
import Navbar from './shared/Navbar';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { Loader2, SearchX } from 'lucide-react'; // Import SearchX for no results icon

const Jobs = () => {
    const { allJobs, searchQuery, isLoading = false } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
       String(searchQuery)
        if (searchQuery) {
            const filtered = allJobs.filter((job) => {
                const title = job?.title?.toLowerCase() || '';
                const description = job?.description?.toLowerCase() || '';
                const location = job?.location?.toLowerCase() || '';
                const salary = job?.salary?.toString().toLowerCase() || '';
                const companyName = job?.company?.name?.toLowerCase() || '';

                const query = searchQuery.toLowerCase();

                return (
                    title.includes(query) ||
                    description.includes(query) ||
                    location.includes(query) ||
                    salary.includes(query) ||
                    companyName.includes(query)
                );
            });
            setFilterJobs(filtered);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchQuery]);

    console.log(searchQuery)


    // Determine if we should show a loading indicator
    const showLoading = isLoading && allJobs.length === 0; // Only show full loading spinner if no jobs loaded yet

    return (
        <div className="bg-gray-50 min-h-screen"> {/* Added a light background to the page */}
            <Navbar />
            <div className="mx-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-8"> {/* Increased gap for better spacing */}
                    {/* Filter Section - Remains fixed width on larger screens */}
                    <div className="w-full lg:w-[320px] flex-shrink-0"> {/* Slightly increased filter card width for more content */}
                        <FilterCard />
                    </div>

                    {/* Job Cards Section */}
                    <div className="flex-1 w-full lg:h-[calc(100vh-160px)] overflow-y-auto pb-5 pr-2 custom-scrollbar"> {/* Added custom-scrollbar class for styling */}
                        <AnimatePresence mode="wait"> {/* Use AnimatePresence for transitions when content changes */}
                            {showLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col justify-center items-center h-full min-h-[400px] text-gray-500"
                                >
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                                    <p className="text-xl font-medium text-gray-700">Fetching amazing job opportunities...</p>
                                    <p className="text-md text-gray-500 mt-2">Please wait a moment.</p>
                                </motion.div>
                            ) : filterJobs.length === 0 ? (
                                <motion.div
                                    key="no-jobs"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500 p-4 text-center bg-white rounded-lg shadow-sm border border-gray-100"
                                >
                                    <SearchX className="h-16 w-16 text-gray-400 mb-6" /> {/* Larger icon */}
                                    <h3 className="text-3xl font-bold mb-3 text-gray-800">No Jobs Found</h3>
                                    {String(searchQuery) ? (
                                        <p className="text-lg leading-relaxed">
                                            Your search for "<span className="font-semibold text-blue-600">{String(searchQuery)}</span>" did not yield any results.
                                            Try broadening your search or checking for typos.
                                        </p>
                                    ) : (
                                        <p className="text-lg leading-relaxed">
                                            It looks like there are currently no jobs available. Please check back later,
                                            or consider posting a job if you're a recruiter!
                                        </p>
                                    )}
                                    <p className="mt-6 text-md text-gray-600">
                                        You can also try adjusting your filters or exploring other categories.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="job-list"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {filterJobs.map((job, index) => (
                                        <motion.div
                                            key={job._id || index}
                                            initial={{ opacity: 0, y: 40 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.07, type: 'spring', stiffness: 120, damping: 15 }}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {/* Custom Scrollbar CSS (add this to your global CSS or a styled-components/emotion setup) */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default Jobs;