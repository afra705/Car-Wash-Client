"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const result = Object.fromEntries(formData.entries());

  try {
    const { data, error } = await signIn.email({
      email: result.email as string,
      password: result.password as string,
      rememberMe: true,
      callbackURL: "/",
    });


    if (error) {
      toast.error(error.message || "Sign in failed!");
      return;
    }

    toast.success("Logged in successfully!");

    console.log(data);
  } catch (error) {
    console.error("Sign in error:", error);
    toast.error("Something went wrong. Please try again!");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cleanify</h1>
          <p className="text-xs text-gray-400 mt-1">To clean your car always</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              <span className="text-red-500 mr-1">*</span>Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Input your email"
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
                placeholder="Input your password"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FACC15] hover:bg-[#eab308] text-white font-semibold text-sm py-2.5 rounded-md transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-800">New here?</span>
            <Link
              href="/signup"
              className="border border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 font-medium px-4 py-1 rounded-md text-xs transition-colors"
            >
              Signup
            </Link>
          </div>

          <Link
            href="/forgot-password"
            className="text-gray-800 hover:underline font-medium text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-100" />

        {/* Demo Credentials Table */}
        <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-800 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 border-l border-gray-100">
                  Password
                </th>
                <th className="py-3 px-4 border-l border-gray-100">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-3 px-4">admin@gmail.com</td>
                <td className="py-3 px-4">1234@@aA</td>
                <td className="py-3 px-4">admin</td>
              </tr>
              <tr>
                <td className="py-3 px-4">user@gmail.com</td>
                <td className="py-3 px-4">1234@@aA</td>
                <td className="py-3 px-4">user</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;