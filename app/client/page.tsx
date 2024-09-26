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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Client Information</h1>
      <div className="p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl">
        <p className="text-white"><strong>Name:</strong> {client.name}</p>
        <p className="text-white"><strong>Address:</strong> {client.address}</p>
        <p className="text-white"><strong>Phone:</strong> {client.phone}</p>
        <p className="text-white"><strong>Email:</strong> {client.email}</p>
        <p className="text-white"><strong>Scheduled Date:</strong> {client.scheduled_date}</p>
        <p className="text-white"><strong>Signed Bid:</strong> {client.signed_bid ? "Yes" : "No"}</p>
        {client.step === 1 && (
          <div className="mt-4">
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