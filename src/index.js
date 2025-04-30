import React from "react"
// ✅ Import existing store

import { configureStore } from "@reduxjs/toolkit"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import rootReducer from "./reducer"
import store from "./redux/store"

// ✅ Ensure this file exists

// ✅ Rename the second store declaration
const newStore = configureStore({
  reducer: rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Provider store={newStore}>
      {" "}
      {/* ✅ Use newStore instead of store */}
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
