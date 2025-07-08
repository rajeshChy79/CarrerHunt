import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea'; // Assuming you have a textarea component
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constants';
import { Loader2, UploadCloud, FileText } from 'lucide-react'; // Added more icons
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from "../redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
    // Local loading state for the dialog itself
    const [dialogLoading, setDialogLoading] = useState(false);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Initialize input state with user data and handle potential undefined values
    const [input, setInput] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.join(', ') || '', // Join skills array into a string for the input
        resume: user?.profile?.resume || null // Store existing resume URL or null
    });

    const [selectedFile, setSelectedFile] = useState(null); // State to hold the newly selected file object

    // Use useEffect to update input state if user data changes (e.g., after initial load)
    useEffect(() => {
        if (user) {
            setInput({
                fullName: user?.fullName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                bio: user?.profile?.bio || '',
                skills: user?.profile?.skills?.join(', ') || '',
                resume: user?.profile?.resume || null
            });
            setSelectedFile(null); // Reset selected file on user change
        }
    }, [user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file); // Set the file object
        } else {
            setSelectedFile(null);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setDialogLoading(true); // Start loading

        try {
            const formData = new FormData();
            formData.append("fullName", input.fullName);
            formData.append("email", input.email);
            formData.append("phoneNumber", input.phoneNumber);
            formData.append("bio", input.bio);
            formData.append("skills", input.skills); // Skills are already a comma-separated string

            // Only append a new file if one is selected
            if (selectedFile) {
                formData.append("file", selectedFile); // Use 'resume' as field name for consistency
            } else if (input.resume) {
                // If no new file is selected but an old resume exists, send its URL to indicate it's retained
                formData.append("resumeUrl", input.resume);
            }


            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user)); // Update Redux store with new user data
                toast.success(res.data.message);
                setOpen(false); // Close dialog after success
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error(err?.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setDialogLoading(false); // End loading
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}> {/* Use onOpenChange for controlled dialog state */}
            <DialogContent className="sm:max-w-md md:max-w-xl bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">Update Your Profile</DialogTitle>
                    <DialogDescription className="text-gray-600 text-base">
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} className="mt-6 space-y-5"> {/* Added spacing */}
                    {/* Full Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                        <Label htmlFor="fullName" className="text-left sm:text-right text-base font-medium text-gray-700">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={input.fullName}
                            onChange={changeEventHandler}
                            className="col-span-3 h-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                        <Label htmlFor="email" className="text-left sm:text-right text-base font-medium text-gray-700">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="col-span-3 h-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            disabled // Email usually cannot be changed easily
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                        <Label htmlFor="phoneNumber" className="text-left sm:text-right text-base font-medium text-gray-700">Phone No.</Label>
                        <Input
                            id="phoneNumber"
                            type="tel" // Use type="tel" for phone numbers
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            className="col-span-3 h-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>

                    {/* Bio */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-3"> {/* Use items-start for textarea */}
                        <Label htmlFor="bio" className="text-left sm:text-right text-base font-medium text-gray-700 mt-2">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            className="col-span-3 min-h-[80px] px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>

                    {/* Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                        <Label htmlFor="skills" className="text-left sm:text-right text-base font-medium text-gray-700">Skills</Label>
                        <Input
                            id="skills"
                            type="text"
                            name="skills"
                            value={input.skills}
                            onChange={changeEventHandler}
                            className="col-span-3 h-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="e.g., React, Node.js, AWS (comma separated)"
                        />
                    </div>

                    {/* Resume Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                        <Label htmlFor="resumeFile" className="text-left sm:text-right text-base font-medium text-gray-700">Resume</Label>
                        <div className="col-span-3 flex flex-col gap-2">
                            <Input
                                id="resumeFile"
                                name="resumeFile" // Changed name to avoid conflict with 'resume' state
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="col-span-3 file:text-blue-600 file:bg-blue-50 file:border-blue-200 file:rounded-md file:border-0 file:text-sm file:font-medium hover:file:bg-blue-100 file:px-4 file:py-2"
                            />
                            {/* Display current/selected resume info */}
                            {(input.resume || selectedFile) && (
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    {selectedFile ? (
                                        <>New: <span className="font-medium text-blue-700">{selectedFile.name}</span></>
                                    ) : (
                                        <>Current: <a href={input.resume} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-700">View Resume</a></>
                                    )}
                                </p>
                            )}
                            {!input.resume && !selectedFile && (
                                <p className="text-sm text-gray-500">No resume uploaded. Upload a PDF file.</p>
                            )}
                        </div>
                    </div>

                    {/* Dialog Footer with Action Buttons */}
                    <DialogFooter className="mt-8 flex justify-end"> {/* Flex end to align button right */}
                        <Button
                            type="button" // Important: set type="button" to prevent form submission
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 rounded-md"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-md flex items-center gap-2"
                            disabled={dialogLoading} // Disable button when loading
                        >
                            {dialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {dialogLoading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;