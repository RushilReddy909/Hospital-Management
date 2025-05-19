import { create } from "zustand";
import { admin } from "@/utils/api";

const useAdminStore = create((set) => ({
  doctors: [],
  patients: [],
  users: [],
  setDoctors: (doctors) => set({ doctors }),
  setPatients: (patients) => set({ patients }),
  setUsers: (users) => set({ users }),

  fetchAll: async () => {
    try {
      const [doctorsRes, patientsRes, usersRes] = await Promise.all([
        admin.get("/doctors"),
        admin.get("/patients"),
        admin.get("/users"),
      ]);

      set({
        doctors: doctorsRes.data.data,
        patients: patientsRes.data.data,
        users: usersRes.data.data,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  },
}));

export default useAdminStore;
