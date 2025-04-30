import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="my-10 flex flex-col rounded-md border-[1px] border-pink-700 bg-pink-900 p-6 sm:flex-row sm:gap-x-5 sm:p-8">
      <div className="mb-4 flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700 sm:mb-0">
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-richblack-5 sm:text-xl">
          Delete Account
        </h2>
        <div className="w-full text-pink-25 sm:w-3/5">
          <p className="text-sm sm:text-base">
            Would you like to delete your account?
          </p>
          <p className="text-sm sm:text-base">
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the content associated with it.
          </p>
        </div>
        <button
          type="button"
          className="w-fit cursor-pointer text-sm italic text-pink-300 sm:text-base"
          onClick={handleDeleteAccount}
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  )
}
