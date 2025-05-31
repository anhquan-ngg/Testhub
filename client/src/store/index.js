import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const store = (set, get) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => {
        set({userInfo});
    },
    clearUserInfo: () => {
        set({userInfo: undefined});
    }
})

export const useAppStore = create(
    devtools(
        persist(
            store,
            {
                name: 'user-storage', // key trong localStorage
                partialize: (state) => ({ userInfo: state.userInfo }), // chỉ persist userInfo
            }
        )
    )
);
