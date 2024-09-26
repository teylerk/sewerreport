"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearchParams } from "next/navigation";

interface Client {
  name: string;
  address: string;
  phone: string;
  email: string;
  scheduled_date: string;
  signed_bid: boolean;
  step: number;
}

export default function ClientPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");

  useEffect(() => {
    const fetchClient = async () => {
      const { data } = await supabase.from("clients").select("*").eq("pin", pin).single();
      if (data) {
        setClient(data);
        setCurrentStep(data.step);
      }
    };

    fetchClient();
  }, [pin]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 10));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Client Information</h1>
        {client ? (
          <div>
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Address:</strong> {client.address}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Scheduled Date:</strong> {client.scheduled_date}</p>
            <p><strong>Signed Bid:</strong> {client.signed_bid ? "Yes" : "No"}</p>
            <p><strong>Step:</strong> {currentStep}</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(currentStep / 10) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  disabled={currentStep === 1}
                >
                  Previous Step
                </button>
                <span>Step {currentStep} of 10</span>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={currentStep === 10}
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}