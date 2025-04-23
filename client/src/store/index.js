import { create } from 'zustand';
import { createAuthSlice } from './slice/auth-slice';

export const useAppStore = create()((...args) => ({
    ...createAuthSlice(...args),
}));