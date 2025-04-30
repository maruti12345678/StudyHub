import * as AiIcons from "react-icons/ai"
import * as VscIcons from "react-icons/vsc"

import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: VscIcons.VscAccount,
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscIcons.VscDashboard,
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscIcons.VscVm,
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscIcons.VscAdd,
  },
  {
    id: 5,
    name: "Sentiment Analysis",
    path: "/sentiment-analysis",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: VscIcons.VscSmiley,
  },
  {
    id: 6,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: VscIcons.VscMortarBoard,
  },
  {
    id: 7,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: VscIcons.VscHistory,
  },
  {
    id: 8,
    name: "Quiz History",
    path: "/dashboard/quiz/history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: VscIcons.VscQuestion,
  },
  {
    id: 9,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: AiIcons.AiOutlineShoppingCart,
  },
]
