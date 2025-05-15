import { api } from "@/utils/api";
import React, { useEffect } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

const Home = () => {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/patient");
        if (!res) {
          throw new Error("Patient details not found");
        }
      } catch (err) {
        toast.info(
          <div>
            <h1>No patient record found. Would you like to create one?</h1>
            <div className="flex justify-end mt-3 mb-2">
              <button>
                <a
                  href="/account"
                  className="text-md font-semibold px-2.5 py-2 rounded-md text-blue-950 border-2 border-blue-950 hover:bg-blue-950 hover:text-white transition-colors"
                >
                  To Account
                </a>
              </button>
            </div>
          </div>
        );
      }
    };

    checkUser();
  }, []);

  return (
    <>
      <ToastContainer
        limit={4}
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        theme="colored"
        transition={Slide}
      ></ToastContainer>
    </>
  );
};

export default Home;
