"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload, Lock, Eye, EyeOff } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter()
const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)
  const result = Object.fromEntries(formData.entries())

  try {
    const { data, error } = await signUp.email({
      name: result.name as string,
      email: result.email as string,
      password: result.password as string,
      callbackURL: "/",
    })

    if (error) {
      toast.error(error.message || "Sign up failed!")
      return
    }
    router.push('/signin')
    toast.success("Account created successfully!")

    console.log(data)
  } catch (error) {
    console.error("Sign up error:", error)
    toast.error("Something went wrong. Please try again!")
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-center text-xl font-semibold text-gray-900 mb-6">
          Signup to <span className="text-[#FACC15] font-bold">Cleanify</span>
        </h1>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Profile Image
            </label>
            <label className="w-24 h-24 rounded-lg border border-dashed border-gray-300 bg-gray-50/70 hover:bg-gray-100/70 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-700 font-medium">Upload</span>
              <input type="file" name="profileImage" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter name here"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter email here"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter password here"
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FACC15]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Enter phone number here"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Address
            </label>
            <input
              type="text"
              name="address"
              required
              placeholder="Enter address here"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FACC15] hover:bg-[#eab308] text-white font-semibold text-sm py-2.5 rounded-md transition-colors cursor-pointer mt-2"
          >
            Signup
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="text-gray-800">Already have an account?</span>
          <Link
            href="/signin"
            className="border border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 font-medium px-4 py-1 rounded-md text-xs transition-colors"
          >
            Signin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;             