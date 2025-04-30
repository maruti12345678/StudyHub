import { createContext, useContext, useState } from "react"
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
import * as AiIcons from "react-icons/ai"
import * as VscIcons from "react-icons/vsc"
import { VscSettingsGear, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import { resetCourseState } from "../../../slices/courseSlice"
import ConfirmationModal from "../../Common/ConfirmationModal"

// import SidebarLink from "./SidebarLink"

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [expanded, setExpanded] = useState(true)
  const location = useLocation()
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] place-items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`flex h-[calc(100vh-3.5rem)] ${
          expanded ? "w-[220px]" : "w-[60px]"
        } transition-width flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 duration-300`}
      >
        <div className="flex items-center justify-end">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="bg-gray-50 rounded-full p-1.5 text-richblack-50 hover:bg-richblack-700"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          {/* <ul className="flex-1 px-3">{children}</ul> */}
          <div className="flex flex-col">
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null
              return (
                <SidebarLink key={link.id} link={link} iconName={link.icon} />
              )
            })}
          </div>
        </SidebarContext.Provider>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          {/* Settings Link */}
          <NavLink
            to="/dashboard/settings"
            className={`group relative ${
              expanded ? "px-8 py-2" : "px-2 py-2"
            } flex items-center gap-x-2 text-sm font-medium transition-all duration-300 ${
              matchPath({ path: "/dashboard/settings" }, location.pathname)
                ? "bg-yellow-800 text-yellow-50"
                : "bg-opacity-0 text-richblack-300"
            }`}
          >
            <VscSettingsGear className="text-lg" />
            <span
              className={`overflow-hidden transition-all ${
                expanded ? "block" : "hidden"
              }`}
            >
              Settings
            </span>
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className={`group relative ${
              expanded ? "px-8 py-2" : "px-2 py-2"
            } flex items-center gap-x-2 text-sm font-medium transition-all duration-300 ${
              expanded
                ? "text-richblack-300"
                : "bg-opacity-0 text-richblack-300"
            }`}
          >
            <VscSignOut className="text-lg" />
            <span
              className={`overflow-hidden transition-all ${
                expanded ? "block" : "hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        {/* <div
          className={`flex items-center ${
            expanded ? "p-3" : "p-1"
          } transition-all duration-300`}
        >
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-10 rounded-full object-cover"
          />
          <div
            className={`flex flex-col ${
              expanded ? "ml-3 w-52" : "hidden"
            } transition-all duration-300`}
          >
            <h4 className="truncate font-semibold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="truncate text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div> */}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export function SidebarLink({ link }) {
  const { expanded } = useContext(SidebarContext)
  const location = useLocation()
  const dispatch = useDispatch()
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  // Resolve the icon dynamically based on the passed `link.icon`
  const Icon = VscIcons[link.icon?.name] || AiIcons[link.icon?.name] || null

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`group relative ${
        expanded ? "px-8 py-2" : "px-2 py-2"
      } flex items-center gap-x-2 text-sm font-medium transition-all duration-300 ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full ${
          matchRoute(link.path) ? "w-[0.15rem]" : "w-0"
        } bg-yellow-50 transition-all duration-300`}
      ></span>

      {Icon && <Icon className="text-lg" />}
      <span className={`${expanded ? "block" : "hidden"}`}>{link.name}</span>
    </NavLink>
  )
}
