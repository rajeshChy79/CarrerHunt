import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { COMPANY_API_END_POINT } from '../../utils/constants';
import axios from 'axios';
import useGetCompanyById from "../../hooks/useGetCompanyById";

const CompanySetUp = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
    currentLogoUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const { singleCompany } = useSelector(store => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res?.data?.message);
        navigate("/admin/companies");
      }
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error(err.response?.data?.message || "Failed to update company details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
        currentLogoUrl: singleCompany.logo || ""
      });
    }
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4'>
        <form onSubmit={submitHandler} className='w-full max-w-2xl bg-white rounded-xl p-8 shadow-xl border border-gray-100'>
          {/* Back Button */}
          <div className='mb-6'>
            <Button
              variant="ghost"
              className="text-gray-600 hover:bg-gray-100 flex items-center gap-1 font-medium px-3 py-2 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/admin/companies")}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Companies</span>
            </Button>
          </div>

          {/* Header */}
          <div className='mb-8 pb-4 border-b border-gray-200'>
            <h1 className='font-extrabold text-3xl text-gray-800'>Company Setup</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and update your company's profile information.</p>
          </div>

          {/* Form Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div>
              <Label htmlFor="name" className="mb-2 block">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <Label htmlFor="website" className="mb-2 block">Website</Label>
              <Input
                id="website"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-2 block">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Tell us about your company..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location" className="mb-2 block">Location</Label>
              <Input
                id="location"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g., Bengaluru, India"
              />
            </div>

            <div>
              <Label htmlFor="logo" className="mb-2 block">Company Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
              {input.currentLogoUrl && !input.file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <img src={input.currentLogoUrl} alt="Current Logo" className="h-8 w-8 object-contain rounded-sm border" />
                  <span>Current Logo</span>
                </div>
              )}
              {input.file && (
                <p className="text-sm text-gray-500 mt-2">New file selected: {input.file.name}</p>
              )}
            </div>
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="w-full md:w-auto flex-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 min-w-[100px]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full md:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold min-w-[100px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetUp;