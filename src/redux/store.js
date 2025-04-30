import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./authSlice"

// ✅ Ensure correct path

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ 'auth' should be a key in Redux state
  },
})

export default store
