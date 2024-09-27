import { Client } from '@/app/admin/types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  client: Partial<Client>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing: boolean;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSubmit,
  client,
  onChange,
  isEditing
}: ClientModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">{isEditing ? "Edit Client" : "Add New Client"}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={client.name || ''}
            onChange={onChange}
            placeholder="Client Name"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="text"
            name="address"
            value={client.address || ''}
            onChange={onChange}
            placeholder="Address"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="tel"
            name="phone"
            value={client.phone || ''}
            onChange={onChange}
            placeholder="Phone"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="email"
            name="email"
            value={client.email || ''}
            onChange={onChange}
            placeholder="Email"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="date"
            name="scheduled_date"
            value={client.scheduled_date || ''}
            onChange={onChange}
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              name="signed_bid"
              checked={client.signed_bid || false}
              onChange={onChange}
              className="mr-2"
            />
            Signed Bid?
          </label>
          <input
            type="text"
            name="docusign_link"
            value={client.docusign_link || ''}
            onChange={onChange}
            placeholder="DocuSign Link"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <textarea
            name="notes"
            value={client.notes || ''}
            onChange={onChange}
            placeholder="Notes"
            className="w-full px-4 py-3 border border-purple-300 bg-white bg-opacity-20 rounded-lg text-black placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition duration-300"
          >
            {isEditing ? "Update Client" : "Add Client"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition duration-300 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}