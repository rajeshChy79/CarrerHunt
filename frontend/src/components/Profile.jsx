import React, { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Navbar from './shared/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '../hooks/useGetAppliedJobs';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(state => state.auth);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Profile Header Section */}
        <div className='bg-white shadow-lg rounded-xl p-8 mb-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
            <div className='flex items-center gap-6'>
              <Avatar className='w-24 h-24 sm:w-32 sm:h-32 shadow-md'>
                <AvatarImage src={user?.profile?.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className='object-cover' />
              </Avatar>
              <div>
                <h1 className='text-3xl font-bold text-gray-800 mb-1'>{user?.fullName || 'Your Name'}</h1>
                <p className='text-md text-gray-600 mb-1'>{user?.email || 'your.email@example.com'}</p>
                <p className='text-md text-gray-600'>{user?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
            <Button
              variant="default"
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold transition duration-300 ease-in-out'
              onClick={() => setOpen(true)}
            >
              Edit Profile
            </Button>
          </div>

          <hr className='my-8 border-gray-200' />

          {/* Skills Section */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Skills</h2>
            {user?.profile?.skills && user.profile.skills.length > 0 ? (
              <div className='flex flex-wrap gap-3'>
                {user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-md rounded-full font-medium transition duration-300 ease-in-out"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>No skills added yet.</p>
            )}
          </div>

          {/* Resume Section */}
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Resume</h2>
            {user?.profile?.resume ? (
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out group'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {user.profile.resumeOriginalName || 'View Resume'}
              </a>
            ) : (
              <p className='text-gray-500'>No resume uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className='bg-white shadow-lg rounded-xl p-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Your Applied Jobs</h2>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;