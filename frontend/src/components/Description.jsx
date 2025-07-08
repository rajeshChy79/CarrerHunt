import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleJob } from "../redux/jobSlice";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utils/constants";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, MapPin, DollarSign, Briefcase, Users, CalendarDays, FlaskConical } from 'lucide-react'; // Added more relevant icons

const Description = () => {
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);

  const [isApplied, setIsApplied] = useState(false);
  const [loadingApplication, setLoadingApplication] = useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(true); // New state for job details loading

  useEffect(() => {
    const fetchSingleJob = async () => {
      setLoadingJobDetails(true); // Start loading job details
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          // Set initial isApplied state based on fetched job data
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
          toast.success("Job details loaded successfully!");
        } else {
          toast.error(res.data.message || "Failed to load job details.");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        toast.error(err?.response?.data?.message || "Something went wrong fetching job details.");
      } finally {
        setLoadingJobDetails(false); // End loading job details
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]); // Re-fetch if jobId or user._id changes

  const applyJobHandler = async () => {
    setLoadingApplication(true); // Start loading for application
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        // Optimistically update singleJob in Redux with the new application
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to apply for the job.");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      toast.error(err?.response?.data?.message || "Something went wrong during application.");
    } finally {
      setLoadingApplication(false); // End loading for application
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loadingJobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-xl font-medium text-gray-700">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Job Not Found</h2>
          <p className="text-gray-600">The job you are looking for does not exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 border border-gray-100">
        {/* Company and Job Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {singleJob?.title}
            </h1>
            <p className="text-xl text-gray-600 font-semibold flex items-center gap-2">
              <Building2 className="text-blue-500" size={24} /> {singleJob?.company?.name || "N/A"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex-shrink-0">
            {isApplied ? (
              <Button
                disabled
                className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-600 cursor-not-allowed text-base font-semibold rounded-lg shadow-sm"
              >
                Application Submitted
              </Button>
            ) : (
              <Button
                onClick={applyJobHandler}
                disabled={loadingApplication}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out text-base font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
              >
                {loadingApplication && <Loader2 className="h-5 w-5 animate-spin" />}
                {loadingApplication ? "Applying..." : "Apply Now"}
              </Button>
            )}
          </div>
        </div>

        {/* Job Details Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 rounded-md p-3 font-medium">
                <Users size={20} />
                <span>{singleJob?.position} Positions</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-800 rounded-md p-3 font-medium">
                <Briefcase size={20} />
                <span>{singleJob?.jobType}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 rounded-md p-3 font-medium">
                <DollarSign size={20} />
                <span>{singleJob?.salary} LPA</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-800 rounded-md p-3 font-medium">
                <MapPin size={20} />
                <span>{singleJob?.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 text-red-800 rounded-md p-3 font-medium">
                <FlaskConical size={20} /> {/* Using FlaskConical for experience */}
                <span>{singleJob?.experience} Years Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 text-gray-800 rounded-md p-3 font-medium">
                <CalendarDays size={20} />
                <span>Posted on: {formatDate(singleJob?.createdAt)}</span>
            </div>
        </div>

        {/* Job Description and Requirements */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2">Job Description</h2>
          <p className="text-lg">
            {singleJob?.description || "No description provided."}
          </p>

          {singleJob?.requirements && singleJob.requirements.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2 pt-4">Key Responsibilities & Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-lg">
                {singleJob.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2 pt-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <p>
              <strong className="font-semibold text-gray-800">Job Type:</strong> {singleJob?.jobType || "N/A"}
            </p>
            <p>
              <strong className="font-semibold text-gray-800">Experience Level:</strong> {singleJob?.experience} years
            </p>
            <p>
              <strong className="font-semibold text-gray-800">Location:</strong> {singleJob?.location || "N/A"}
            </p>
            <p>
              <strong className="font-semibold text-gray-800">Salary Range:</strong> {singleJob?.salary} LPA
            </p>
            <p>
              <strong className="font-semibold text-gray-800">Total Positions:</strong> {singleJob?.position}
            </p>
            <p>
              <strong className="font-semibold text-gray-800">Total Applicants:</strong> {singleJob?.applications?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;