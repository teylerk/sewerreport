"use client";

import { useEffect, useState, Suspense } from "react";
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

    fetchClient();
  }, [pin]);

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
            <p><strong>Step:</strong> {client.step}</p>
            {client.step === 1 && (
              <div className="mt-4">
                <p className="text-yellow-300">Please click here to sign:</p>
                <a
                  href={client.docusign_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {client.docusign_link}
                </a>
                <p className="mt-2">Once signed, please wait for 24 hours for the next step to appear.</p>
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
                <span>Step {client.step} of 10</span>
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

export default ClientPageContent;