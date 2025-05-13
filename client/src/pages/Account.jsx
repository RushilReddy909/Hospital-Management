import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";

const Profile = () => {
  const [details, setDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/patients/self");
        setDetails(res.data.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error(
            err.response?.data?.message || "Error fetching your data",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Hello World</h1>
    </>
  );
};

export default Profile;
