'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Save token to sessionStorage
      sessionStorage.setItem('token', data.token);
      // Optionally, save admin info to sessionStorage
      sessionStorage.setItem('admin', data.name);

      sessionStorage.setItem('img_path', data.imgPath);
      // sessionStorage.setItem('admin_id', data.); // Uncomment if needed

      // Redirect to dashboard or another page
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Image */}
      <div className="hidden md:flex md:w-[65%] items-center justify-center bg-[url('/bg_image.jpg')] bg-cover bg-center">
        <img
          src="/vita_logo.png"
          alt="Login Visual"
          className="w-90 h-72 object-contain"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full md:w-[35%] items-center justify-center bg-transparent">
        <div className="relative w-[350px] h-[440px]">
          <div className="absolute -top-5 -left-8 w-20 h-20 bg-blue-600 rounded-full"></div>
          <div className="absolute bottom-14 -right-5 w-20 h-20 bg-orange-500 rounded-full"></div>

          <div className="absolute w-full max-w-[400px] px-8 py-5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.4)] backdrop-blur-[5px] bg-white/30 flex flex-col font-sans">
            <p className="text-[28px] font-extrabold leading-none">Admin login</p>
            <form onSubmit={handleLogin}>
              <div className="mt-2">
                <p className="text-[14px] font-semibold text-slate-500 mt-[15px] mb-0">Username</p>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-1 mb-[5px] rounded-[8px] bg-transparent shadow-[0_2px_5px_rgba(0,0,0,0.4)] font-semibold text-blue-600 placeholder-gray-400 focus:outline-none hover:shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Email id"
                />
              </div>

              <div>
                <p className="text-[14px] font-semibold text-slate-500 mt-[15px] mb-0">Password</p>
                <input
                  type="password"
                  className="w-full px-4 py-2 mt-1 mb-[5px] rounded-[8px] bg-transparent shadow-[0_2px_5px_rgba(0,0,0,0.4)] font-semibold text-blue-600 placeholder-gray-400 focus:outline-none hover:shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
              </div>

              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

              <button
                type="submit"
                className="w-full mt-5 mb-2 py-2 px-4 text-[16px] font-bold text-white rounded-[8px] bg-blue-600 hover:bg-[#0653c7]"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
