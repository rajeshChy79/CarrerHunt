import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_END_POINT } from "../utils/constants";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        console.log(res)

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.appliedJobs));
        }
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };

    // ✅ Correct placement of the function call
    fetchAppliedJobs();
  }, [dispatch]); // it's good practice to include dispatch in the dependency array
};

export default useGetAppliedJobs;
