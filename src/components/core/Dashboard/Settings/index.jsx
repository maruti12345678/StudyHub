import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-semibold text-richblack-5 sm:mb-12 sm:text-3xl">
        Edit Profile
      </h1>
      <div className="flex flex-col gap-8">
        {/* Change Profile Picture */}
        <section className="rounded-lg border border-richblack-600 bg-richblack-800 p-4 sm:p-6">
          <ChangeProfilePicture />
        </section>

        {/* Profile Section */}
        <section className="rounded-lg border border-richblack-600 bg-richblack-800 p-4 sm:p-6">
          <EditProfile />
        </section>

        {/* Password Update */}
        <section className="rounded-lg border border-richblack-600 bg-richblack-800 p-4 sm:p-6">
          <UpdatePassword />
        </section>

        {/* Delete Account */}
        <section className="border-red-600 rounded-lg border bg-richblack-800 p-4 sm:p-6">
          <DeleteAccount />
        </section>
      </div>
    </div>
  )
}
