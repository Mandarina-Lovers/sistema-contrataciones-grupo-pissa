"use client";
import React from "react";
import { useRouter } from "next/compat/router";

export default function User() {
  const router = useRouter();
  const handleLink = () => {
  }  
  
  return (
    <div className="flex flex-col items-center  p-6 min-h-screen w-300">
      <h1 className="text-4xl font-extrabold text-black mb-6">User Information</h1>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-96 text-center transform transition duration-500 hover:scale-105">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
        />
        <h2 className="text-2xl font-bold text-gray-800">{"lorem ipsum"}</h2>
        <p className="text-gray-600 text-sm">{"lorem ipsum"}</p>
        <p className="mt-4 text-gray-700 text-md italic">{"lorem ipsum"}</p>
      </div>
    </div>
  );
}
