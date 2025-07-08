import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '../../redux/companySlice';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../../utils/constants';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading state

const CompanyCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty.");
      return;
    }

    setLoading(true); // Set loading to true before API call
    try {
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`); // Navigate to setup page
      }
    } catch (error) {
      console.error("Error registering company:", error); // Use console.error for errors
      toast.error(error.response?.data?.message || "Failed to register company.");
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Name Your Company</h1>
            <p className="text-sm text-gray-500">
              What would you like to call your new company? You can change this later.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <Input
              id="companyName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., Acme Corp, Tech Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-3 mt-8'>
            <Button
              variant="outline"
              className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={() => navigate("/admin/companies")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
              onClick={registerNewCompany}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;