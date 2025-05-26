import { create } from "zustand";
import { admin } from "@/utils/api";

const useUserStore = create((set, get) => ({
  user: null,
  roleData: null,

  setUser: (user) => set({ user }),

  fetchRoleData: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const res = await admin.get(`/${user.role}s/${user._id}`);
      set({ roleData: res.data.data });
    } catch (err) {
      console.error(err);
    }
  },

  clearUser: () => set({ user: null, roleData: null }),
}));

export default useUserStore;
