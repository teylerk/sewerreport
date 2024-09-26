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
  });
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
      setClients(data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleNextStep = async (client: Client) => {
    const newStep = Math.min(client.step + 1, 10);
    const { error } = await supabase
      .from("clients")
      .update({ step: newStep })
      .eq("id", client.id);
    if (!error) {
      fetchClients();
    }
  };

  const handlePreviousStep = async (client: Client) => {
    const newStep = Math.max(client.step - 1, 1);
    const { error } = await supabase
      .from("clients")
      .update({ step: newStep })
      .eq("id", client.id);
    if (!error) {
      fetchClients();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => setModalIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Add New Client
      </button>
      <ul>
        {clients.map((client) => (
          <li key={client.id} className="mb-2 p-2 border rounded">
            <p>Name: {client.name}</p>
            <p>Address: {client.address}</p>
            <p>Phone: {client.phone}</p>
            <p>Email: {client.email}</p>
            <p>Scheduled Date: {client.scheduled_date}</p>
            <p>Signed Bid: {client.signed_bid ? "Yes" : "No"}</p>
            <p>PIN: {client.pin}</p>
            <p>Step: {client.step}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePreviousStep(client)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
                disabled={client.step === 1}
              >
                Previous Step
              </button>
              <button
                onClick={() => handleNextStep(client)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
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
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Client</h2>
            <form onSubmit={handleAddClient} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                placeholder="Client Name"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                value={newClient.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 rounded"
                required
              />
              <input
                type="date"
                name="scheduled_date"
                value={newClient.scheduled_date}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="signed_bid"
                  checked={newClient.signed_bid}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Signed Bid?
              </label>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Client
              </button>
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded mt-2"
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