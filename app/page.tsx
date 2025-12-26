import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full px-10 py-3 flex justify-between">
      <label>Home</label>
      <div>
          <Link href={'/login'}>Login</Link>
          <Link href={'/register'} className="ml-5">SignUp</Link>
      </div>
    </div>
  );
}