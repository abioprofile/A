import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types/auth.types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load initial state from localStorage if available
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('user_data');
  
  if (storedToken) {
    initialState.token = storedToken;
  }
  
  if (storedUser) {
    try {
      initialState.user = JSON.parse(storedUser);
      initialState.isAuthenticated = true;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; token: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;

