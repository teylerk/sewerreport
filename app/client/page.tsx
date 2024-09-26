"use client";

import { Suspense, useEffect, useState } from "react";
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
  docusign_link: string; // Include the DocuSign link in the Client interface
}

function ClientPageContent() {
  const [client, setClient] = useState<Client | null>(null);
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");

  useEffect(() => {
    const fetchClient = async () => {
      const { data } = await supabase.from("clients").select("*").eq("pin", pin).single();
      if (data) {
        setClient(data);
      }
    };

    if (pin) {
      fetchClient();
    }
  }, [pin]);

  if (!client) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 animate-gradient">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Client Information</h1>
      <div className="p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl">
        <div className="border border-white p-4 rounded-lg mb-4">
          <p className="text-white"><strong>Name:</strong> {client.name}</p>
        </div>
        <div className="border border-white p-4 rounded-lg mb-4">
          <p className="text-white"><strong>Address:</strong> {client.address}</p>
        </div>
        <div className="border border-white p-4 rounded-lg mb-4">
          <p className="text-white"><strong>Phone:</strong> {client.phone}</p>
        </div>
        <div className="border border-white p-4 rounded-lg mb-4">
          <p className="text-white"><strong>Email:</strong> {client.email}</p>
        </div>
        <div className="border border-white p-4 rounded-lg mb-4">
          <p className="text-white"><strong>Signed Bid:</strong> {client.signed_bid ? "Yes" : "No"}</p>
        </div>
        {client.step === 1 && (
          <div className="mt-4 border border-white p-4 rounded-lg">
            <p className="text-white">Please sign the document using the following link:</p>
            <a
              href={client.docusign_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline"
            >
              {client.docusign_link}
            </a>
            <p className="mt-2 text-white">Once signed, please wait for 24 hours for the next step to appear.</p>
          </div>
        )}
        {client.step === 2 && (
          <div className="mt-4 border border-white p-4 rounded-lg">
            <p className="text-white">Documents Signed, Thank you. Your repair/replacement is scheduled for:</p>
            <p className="text-white font-bold">{client.scheduled_date}</p>
            <p className="mt-2 text-white">We usually arrive around 7am - 8am in the morning. We will let you know if we are going to arrive later in the day.</p>
            <p className="mt-2 text-white text-xs italic">This date may change, sometimes we have delays due to city permitting, unforeseen underground obstacles, and weather.</p>
          </div>
        )}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(client.step / 10) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-white">Step {client.step} of 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ClientPageContent />
    </Suspense>
  );
}