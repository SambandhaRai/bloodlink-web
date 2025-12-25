import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

export default function LoginForm() {
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
                        <ArrowLeft className="h-5 w-5 text-red-700" />
                        </button>

                        <div className='mx-auto max-w-md pt-8'>
                            <h1 className='text-3xl font-semibold text-black'>Login</h1>
                            <p className='text-sm font-extralight mt-2 text-gray-400'>
                                Don't have an account?{" "}
                                <Link href='/register' className='text-sm font-semibold text-red-800 underline'>
                                    Sign Up
                                </Link>
                            </p>

                            <form className='mt-5 space-y-5 text-start'>
                                {/* Email */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Email</label>
                                    <input type='email' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black'/>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className='text-sm font-medium text-gray-400 mx-0.5'>Password</label>
                                    <input type='password' className='mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
                                    focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black'/>
                                </div>

                                {/* Remember me / Forgot pw */}
                                <div className='flex items-center justify-between'>
                                    <label className='flex items-center gap-2 text-sm text-gray-400'>
                                        <input type='checkbox' className='h-3 w-3 rounded border-gray-300 text-red-700 focus:ring-red-800' />
                                        Remember Me
                                    </label>

                                    <Link href='/forgotpassword' className='text-sm font-semibold text-red-800 underline'>Forgot password?</Link>
                                </div>

                                <button type='submit' className='w-full rounded-lg bg-red-800 py-3 text-lg font-semibold text-white'>
                                    Login
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