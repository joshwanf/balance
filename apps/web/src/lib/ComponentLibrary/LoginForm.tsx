"use client"
export const LoginForm = () => {
  return (
    <div>
      <form>
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700">
            Username
          </span>
          <input
            type="text"
            value="tbone"
            className="mt-1 block w-full px-3 py-2 bg-surface border border-neutral-300 rounded-md text-sm shadow-sm placeholder-neutral-400
      focus:outline-none focus:border-info-500 focus:ring-1 focus:ring-info-500
      disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200 disabled:shadow-none
      invalid:border-danger-500 invalid:text-danger-600
      focus:invalid:border-danger-500 focus:invalid:ring-danger-500
    "
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-neutral-700">
            {/* Something here */}
          </span>
          <input
            type="text"
            value="demo@user.io"
            className="mt-1 block w-full px-3 py-2 bg-surface border border-neutral-300 rounded-md text-sm shadow-sm placeholder-neutral-400
      focus:outline-none focus:border-info-500 focus:ring-1 focus:ring-info-500
      disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200 disabled:shadow-none
      invalid:border-danger-500 invalid:text-danger-600
      focus:invalid:border-danger-500 focus:invalid:ring-danger-500
    "
          />
        </label>
      </form>
    </div>
  )
}
