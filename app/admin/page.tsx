"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const allowedEmails = [
  "teylersf@gmail.com",
  "kalintrenchless@gmail.com",
  "spokanerooter@gmail.com",
];

const generatePin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  scheduled_date: string;
  signed_bid: boolean;
  pin: string;
  step: number;
  docusign_link: string;
  notes: string; // Add the notes field to the Client interface
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    scheduled_date: "",
    signed_bid: false,
    docusign_link: "",
    notes: "", // Initialize the notes field
  });
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email && allowedEmails.includes(user.email)) {
        setIsAuthorized(true);
        fetchClients();
      } else {
        router.push("/");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*");
    if (data) {
      // Sort clients by scheduled_date in ascending order
      const sortedClients = data.sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
      setClients(sortedClients);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pin = generatePin();
    const { error } = await supabase.from("clients").insert([{ ...newClient, pin }]);
    if (error) {
      alert("Error adding client");
    } else {
      setModalIsOpen(false);
      fetchClients();
    }
  };

  const handleEditClient = async (client: Client) => {
    setNewClient(client);
    setEditClientId(client.id);
    setModalIsOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.from("clients").update(newClient).eq("id", editClientId);
    if (error) {
      alert("Error updating client");
    } else {
      setModalIsOpen(false);
      fetchClients();
    }
  };

  const handleNextStep = async (client: Client) => {
    if (client.step < 10) {
      const updatedStep = client.step + 1;
      const { error } = await supabase
        .from("clients")
        .update({ step: updatedStep })
        .eq("id", client.id);

      if (error) {
        alert("Error updating step");
      } else {
        fetchClients();
      }
    }
  };

  const handlePreviousStep = async (client: Client) => {
    if (client.step > 1) {
      const updatedStep = client.step - 1;
      const { error } = await supabase
        .from("clients")
        .update({ step: updatedStep })
        .eq("id", client.id);

      if (error) {
        alert("Error updating step");
      } else {
        fetchClients();
      }
    }
  };

  const getClientStepText = (client: Client) => {
    switch (client.step) {
      case 1:
        return (
          <>
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
          </>
        );
      case 2:
        return (
          <>
            <p className="text-white">Documents Signed, Thank you. Your repair/replacement is scheduled for:</p>
            <p className="text-white font-bold">{client.scheduled_date}</p>
            <p className="mt-2 text-white">We usually arrive around 7am - 8am in the morning. We will let you know if we are going to arrive later in the day.</p>
            <p className="mt-2 text-white text-xs italic">This date may change, sometimes we have delays due to city permitting, unforeseen underground obstacles, and weather.</p>
          </>
        );
      default:
        return <p className="text-white">Step {client.step} of 10</p>;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Admin Dashboard</h1>
      <button
        onClick={() => setModalIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition duration-300 mb-8"
      >
        Add New Client
      </button>
      <ul className="space-y-4">
        {clients.map((client) => (
          <li key={client.id} className="p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl">
            <p className="text-white"><strong>Name:</strong> {client.name}</p>
            <p className="text-white"><strong>Address:</strong> {client.address}</p>
            <p className="text-white"><strong>Phone:</strong> {client.phone}</p>
            <p className="text-white"><strong>Email:</strong> {client.email}</p>
            <p className="text-white"><strong>Scheduled Date:</strong> {client.scheduled_date}</p>
            <p className="text-white"><strong>Signed Bid:</strong> {client.signed_bid ? "Yes" : "No"}</p>
            <p className="text-white"><strong>PIN:</strong> {client.pin}</p>
            <p className="text-white"><strong>Step:</strong> {client.step}</p>
            <p className="text-white"><strong>DocuSign Link:</strong> {client.docusign_link}</p>
            <p className="text-white"><strong>Notes:</strong> {client.notes}</p> {/* Display the notes field */}
            <div className="mt-4 border border-white p-4 rounded-lg">
              {getClientStepText(client)}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditClient(client)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handlePreviousStep(client)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                disabled={client.step === 1}
              >
                Previous Step
              </button>
              <button
                onClick={() => handleNextStep(client)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition duration-300"
                disabled={client.step === 10}
              >
                Next Step
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">{editClientId ? "Edit Client" : "Add New Client"}</h2>
            <form onSubmit={editClientId ? handleUpdateClient : handleAddClient} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                placeholder="Client Name"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <input
                type="text"
                name="address"
                value={newClient.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <input
                type="text"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <input
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <input
                type="date"
                name="scheduled_date"
                value={newClient.scheduled_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
              <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  name="signed_bid"
                  checked={newClient.signed_bid}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Signed Bid?
              </label>
              <input
                type="text"
                name="docusign_link"
                value={newClient.docusign_link}
                onChange={handleInputChange}
                placeholder="DocuSign Link"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <textarea
                name="notes"
                value={newClient.notes}
                onChange={handleInputChange}
                placeholder="Notes"
                className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition duration-300"
              >
                {editClientId ? "Update Client" : "Add Client"}
              </button>
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition duration-300 mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}