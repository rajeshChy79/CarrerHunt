import { useEffect } from "react";
import { setCompanies } from "../redux/companySlice";
import { useDispatch } from "react-redux";
import { COMPANY_API_END_POINT } from "../utils/constants";
import axios from "axios";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("hooks works")
    const fetchAllCompanies = async () => {
      try {
        console.log()
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          { withCredentials: true }
        );
        if (res.data.success) {
          console.log(res)
          dispatch(setCompanies(res.data.companies));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCompanies();
  },[]);
};

export default useGetAllCompanies;
