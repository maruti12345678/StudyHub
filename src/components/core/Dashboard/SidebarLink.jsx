import * as AiIcons from "react-icons/ai"
import * as VscIcons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { useContext, createContext, useState } from "react"
import { resetCourseState } from "../../../slices/courseSlice"

const SidebarContext = createContext()

export default function SidebarLink({ link }) {
  // const [expanded, setExpanded] = useState(true)
  // const { expanded } = useContext(SidebarContext)
  const location = useLocation()
  const dispatch = useDispatch()

  // Resolve the icon dynamically based on the passed `link.icon`
  const Icon = VscIcons[link.icon?.name] || AiIcons[link.icon?.name] || null

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center gap-x-2">
        {Icon && <Icon className="text-lg" />}
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}
