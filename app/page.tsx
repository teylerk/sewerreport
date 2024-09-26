"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BarChart2, FileText, Star } from 'lucide-react';
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await supabase.from("clients").select("*").eq("pin", pin);
      if (data && data.length > 0) {
        router.push(`/client?pin=${pin}`);
      } else {
        alert("Incorrect PIN");
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Login failed");
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Sewer Progress Tracker</h1>
          <p className="text-xl text-purple-100">by Kalin Excavation</p>
        </div>
        
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            maxLength={4}
          />
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center">
            Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center">
            Admin Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="pt-6 text-center">
          <a
            href="https://KalinExcavation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-100 hover:text-white transition duration-300"
          >
            Visit KalinExcavation.com
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="text-center">
            <div className="bg-pink-500 bg-opacity-20 p-3 rounded-full inline-block mb-2">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <p className="text-purple-100">Track Progress</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full inline-block mb-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <p className="text-purple-100">View Permits</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-500 bg-opacity-20 p-3 rounded-full inline-block mb-2">
              <Star className="h-6 w-6 text-white" />
            </div>
            <p className="text-purple-100">Leave a Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}
