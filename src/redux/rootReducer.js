import { combineReducers } from "redux"

import authReducer from "./authSlice"

// ✅ Ensure correct import

const rootReducer = combineReducers({
  auth: authReducer, // ✅ Ensure 'auth' key exists in Redux state
})

export default rootReducer
