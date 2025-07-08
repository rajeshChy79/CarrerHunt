import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, BriefcaseBusiness, MapPin, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const AdminJobsTable = () => {
    // Destructuring with default empty array for allAdminJobs and false for isLoading
    const { allAdminJobs = [], searchJobByText, isLoading = false } = useSelector(store => store.job);

    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();

    // Filter jobs based on search text whenever allAdminJobs or searchJobByText changes
    useEffect(() => {
        const filtered = allAdminJobs.filter((job) => {
            const query = searchJobByText?.toLowerCase().trim(); // Trim whitespace from query
            if (!query) {
                return true; // If no search query, show all jobs
            }
            return (
                job?.title?.toLowerCase().includes(query) ||
                job?.company?.name?.toLowerCase().includes(query) ||
                job?.location?.toLowerCase().includes(query)
            );
        });
        setFilterJobs(filtered);
    }, [allAdminJobs, searchJobByText]);

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const showLoading = isLoading; // Alias for clarity

    return (
        <div className="relative min-h-[400px] flex flex-col"> {/* Added min-height to prevent layout shift */}
            {/* Conditional Overlay for Loading State */}
            {showLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                    <div className="py-8 flex flex-col items-center justify-center text-gray-600">
                        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                        <p className="text-xl font-semibold">Loading posted jobs...</p>
                        <p className="text-sm text-gray-500 mt-1">Please wait a moment.</p>
                    </div>
                </div>
            )}

            <Table className="min-w-full divide-y divide-gray-200">
                <TableCaption className="sr-only">A list of your recently posted jobs.</TableCaption> {/* Screen reader only */}
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                        <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {/* Render specific empty/no results messages only when not loading */}
                    {!showLoading && filterJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center text-gray-500 text-lg py-10">
                                {searchJobByText ? (
                                    <>
                                        <p className="font-semibold mb-2">No jobs found matching "{searchJobByText}".</p>
                                        <p className="text-sm">Try adjusting your search filters or clear the search to see all jobs.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold mb-2">No jobs posted yet.</p>
                                        <p className="text-sm">Start by clicking "Post New Job" to add your first listing.</p>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ) : (
                        // Render jobs only if not loading and there are jobs to display
                        !showLoading && filterJobs.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50 transition-colors duration-150">
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-gray-200">
                                            <AvatarImage src={job?.company?.logo} alt={`${job?.company?.name} logo`} className="object-cover" />
                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-base">
                                                {job?.company?.name?.[0]?.toUpperCase() || 'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-gray-900">{job?.company?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                                        <span>{job?.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{job?.location}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                                    {formatDate(job?.createdAt)}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 font-medium px-3 py-1 rounded-full text-xs">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 rounded-md">
                                                <MoreHorizontal className="h-5 w-5" />
                                                <span className="sr-only">Open actions menu</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-1 shadow-lg rounded-md bg-white border border-gray-200 z-50">
                                            <Button
                                                variant="ghost"
                                                className='flex items-center gap-3 w-full justify-start text-gray-700 px-3 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-sm'
                                                onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit Job</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className='flex items-center w-full justify-start gap-3 text-gray-700 px-3 py-2 hover:bg-purple-50 hover:text-purple-600 rounded-sm mt-1'
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                            >
                                                <Eye className='w-4 h-4' />
                                                <span>View Applicants</span>
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;