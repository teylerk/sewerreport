"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SendSMSPage() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, message }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("SMS sent successfully!");
        setTo("");
        setMessage("");
      } else {
        setStatus("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Send SMS</h1>
      <div className="max-w-md mx-auto bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="tel"
            placeholder="To (Phone Number)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <Textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition duration-300">
            Send SMS
          </Button>
        </form>
        {status && (
          <p className="mt-4 text-center text-white">{status}</p>
        )}
      </div>
    </div>
  );
}