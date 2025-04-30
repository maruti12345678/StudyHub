import { useEffect, useState } from "react"
import { NavLink } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { toast } from "react-hot-toast"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa"
import { VscAccount, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import Logo from "../../assets/Logo/Logo-Small-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { logout } from "../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import ConfirmationModal from "./ConfirmationModal"
import {
  mobileNavContainerVariant,
  mobileNavExitProps,
  mobileNavListVariant,
} from "./data/animationConfig"

const activeStyleCallback = ({ isActive }) =>
  isActive ? "selected navlink" : "navlink"

const Navbar = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)

        // Sort categories alphabetically before setting state
        const sortedCategories = res.data.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        setSubLinks(sortedCategories)
      } catch (error) {
        console.error("Could not fetch Categories.", error)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  const toggleNavbar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    setIsOpen(false) // Close mobile nav when the route changes
  }, [location.pathname])

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  let recognition

  if (SpeechRecognition) {
    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setTranscript(spokenText)
      handleSearch(spokenText)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
    }
  }

  const handleSearch = (query) => {
    const matchedCategory = subLinks.find((subLink) =>
      query.toLowerCase().includes(subLink.name.toLowerCase())
    )

    if (matchedCategory) {
      const kebabName = matchedCategory.name.split(" ").join("-").toLowerCase()
      navigate(`/catalog/${kebabName}`)
    } else {
      toast.error("No matching category found for voice input.")
      console.log("Voice input did not match any category:", query)
    }
  }

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
        className={`header sticky top-0 z-[10] flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : "bg-transparent"
        } transition-all duration-200`}
      >
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex flex-row items-center justify-start gap-1">
              <img
                src={Logo}
                alt="Logo"
                width={35}
                height={35}
                loading="lazy"
              />
              <h1 className="text-[22px] font-semibold text-richblack-50">
                StudyHub
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden justify-center md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          subLinks
                            .filter((subLink) => subLink?.courses?.length > 0)
                            .map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                key={i}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Login / Signup / Dashboard */}
          <div className="hidden items-center justify-end gap-x-4 md:flex">
            {/* Voice Search Button */}
            <button
              onClick={startListening}
              className="ml-4 rounded-full bg-richblack-800 p-2 text-white hover:bg-richblack-700"
              title="Voice Search"
            >
              <FaMicrophone className="text-lg" />
            </button>

            {/* Listening Indicator */}
            {isListening && (
              <p className="ml-2 animate-pulse text-sm text-yellow-200">
                Listening...
              </p>
            )}
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {!token && (
              <>
                <Link to="/login">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign up
                  </button>
                </Link>
              </>
            )}
            {token && <ProfileDropdown />}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex w-[50px] items-center justify-end md:hidden">
            {/* Voice Search Button */}
            <button
              onClick={startListening}
              className="ml-4 rounded-full bg-richblack-800 p-2 text-white hover:bg-richblack-700"
              title="Voice Search"
            >
              <FaMicrophone className="text-lg" />
            </button>

            {/* Listening Indicator */}
            {isListening && (
              <p className="ml-2 animate-pulse text-sm text-yellow-200">
                Listening...
              </p>
            )}
            <button
              onClick={toggleNavbar}
              className="relative flex transform items-center justify-center rounded-full bg-richblack-800 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-richblack-700"
              style={{
                height: "50px",
                width: "50px",
              }}
            >
              {isOpen ? (
                <motion.div layout>
                  <X className="transform text-2xl transition-transform duration-300 hover:rotate-45" />
                </motion.div>
              ) : (
                <motion.div layout>
                  <Menu className="transform text-2xl transition-transform duration-300 hover:rotate-45" />
                </motion.div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              layout="position"
              key="nav-links"
              variants={mobileNavContainerVariant}
              initial="hidden"
              animate="show"
              className="mx-auto mt-80 w-[90%] rounded-lg bg-richblack-800/90 py-4 text-center text-white shadow-lg backdrop-blur-md md:hidden"
            >
              <div className="flex flex-col space-y-4">
                {/* Main Navigation Links */}
                {NavbarLinks.map((link, index) =>
                  link.title === "Catalog" ? (
                    <motion.div
                      key={index}
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="relative rounded-md py-2 hover:bg-richblack-700"
                    >
                      {/* Use a separate state for the Catalog dropdown */}
                      <button
                        onClick={() =>
                          setCatalogOpen((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="flex w-full items-center justify-center"
                      >
                        <span>{link.title}</span>
                        <BsChevronDown />
                      </button>
                      {/* Submenu */}
                      {catalogOpen[index] && (
                        <div className="absolute left-0 top-[100%] z-[1000] w-full rounded-lg bg-richblack-700 bg-opacity-90 text-left backdrop-blur-md">
                          {loading ? (
                            <p className="py-2 px-4">Loading...</p>
                          ) : subLinks.length ? (
                            subLinks
                              .filter((subLink) => subLink?.courses?.length > 0)
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="block py-2 px-4 hover:bg-richblack-600"
                                  key={i}
                                >
                                  {subLink.name}
                                </Link>
                              ))
                          ) : (
                            <p className="py-2 px-4">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={index}
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="rounded-md py-2 hover:bg-richblack-700"
                    >
                      <NavLink
                        to={link.path}
                        className="activeStyleCallback py-2 px-4 text-sm font-semibold"
                      >
                        {link.title}
                      </NavLink>
                    </motion.div>
                  )
                )}

                <hr className="my-2 border-richblack-700" />

                {/* Conditionally render Log In / Log Out / Profile */}
                {!token ? (
                  <>
                    {/* Log In Link */}
                    <motion.div
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="rounded-md py-2 hover:bg-richblack-700"
                    >
                      <NavLink
                        to="/login"
                        className="activeStyleCallback py-2 px-4 text-sm font-semibold"
                      >
                        Log In
                      </NavLink>
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.div
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="rounded-md py-2 hover:bg-richblack-700"
                    >
                      <NavLink
                        to="/signup"
                        className="activeStyleCallback py-2 px-4 text-sm font-semibold"
                      >
                        Sign Up
                      </NavLink>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* My Profile Link */}
                    <motion.div
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="rounded-md py-2 hover:bg-richblack-700"
                    >
                      <NavLink
                        to="/dashboard/my-profile"
                        className="activeStyleCallback py-2 px-4 text-sm font-semibold"
                      >
                        My Profile
                      </NavLink>
                    </motion.div>

                    {/* Log Out Link */}
                    <motion.div
                      variants={mobileNavListVariant}
                      {...mobileNavExitProps}
                      className="rounded-md py-2 hover:bg-richblack-700"
                    >
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
                        className="activeStyleCallback py-2 px-4 text-sm font-semibold"
                      >
                        Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Navbar
