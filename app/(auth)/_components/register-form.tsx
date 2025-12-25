"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function RegisterForm() {
    return (
        <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2">
                    {/* LEFT: Form */}
                    <div className="relative p-8 text-center">
                        {/* Back button */}
                        <button
                        type="button"
                        className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                        aria-label="Go back"
                        >
                            <Link href={'/login'}>
                                <ArrowLeft className="h-5 w-5 text-red-700" />
                            </Link>
                        </button>

                        <div className='mx-auto max-w-md pt-8'>
                            <h1 className='text-3xl font-semibold text-black'>Sign Up</h1>
                            <p className='text-sm font-extralight mt-2 text-gray-400'>
                                Already have an account?{" "}
                                <Link href='/login' className='text-sm font-semibold text-red-800 underline'>
                                    Login
                                </Link>
                            </p>

                            <form className='mt-5 space-y-5 text-start'>
                                {/* Full Name */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Full Name</label>
                                    <input type='text' placeholder='Enter you full name' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400' />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Date of Birth</label>
                                    <input type='date' placeholder='DD/MM/YYYY' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400' />
                                </div>
                                
                                {/* Gender */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-400">
                                        Gender
                                    </label>

                                    {/* wrapper ONLY for select + icon */}
                                    <div className="relative">
                                        <select
                                        className="
                                            w-full
                                            appearance-none
                                            rounded-lg
                                            border border-gray-200
                                            px-4 py-2.5 pr-10
                                            text-sm text-gray-700
                                            focus:border-red-600
                                            focus:ring-2 focus:ring-red-100
                                        "
                                        >
                                        <option value="" disabled selected>
                                            Select gender
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        </select>

                                        {/* Perfectly centered arrow */}
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Blood Group */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-400">
                                        Blood Group
                                    </label>

                                    {/* wrapper ONLY for select + icon */}
                                    <div className="relative">
                                        <select
                                        className="
                                            w-full
                                            appearance-none
                                            rounded-lg
                                            border border-gray-200
                                            px-4 py-2.5 pr-10
                                            text-sm text-gray-700
                                            focus:border-red-600
                                            focus:ring-2 focus:ring-red-100
                                        "
                                        >
                                        <option value="" disabled selected>
                                            Select your blood group
                                        </option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        </select>

                                        {/* Perfectly centered arrow */}
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Health Condition */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Prevailing Health Conditions</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Type here..."
                                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black resize-none
                                        outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Email</label>
                                    <input type='email' placeholder='abc@email.com' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400'/>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Password</label>
                                    <input type='password' placeholder='xxxxxx' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400'/>
                                </div>


                                <button type='submit' className='w-full rounded-lg bg-red-800 py-3 text-lg font-semibold text-white'>
                                    Sign Up
                                </button>
                            </form> 

                        </div>
                    </div>
                    {/* RIGHT: Illustration */}
                    <div className="hidden md:flex items-center justify-center p-5">
                        <div className="relative w-full max-w-md">
                        <Image
                            src="/images/Login.png"
                            alt="Login illustration"
                            width={520}
                            height={420}
                            className="w-full h-auto"
                            priority
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}