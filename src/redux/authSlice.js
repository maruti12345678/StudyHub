import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // ✅ Persist user
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload)) // ✅ Save to localStorage
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem("user") // ✅ Clear user on logout
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
