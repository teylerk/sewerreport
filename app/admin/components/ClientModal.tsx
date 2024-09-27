import { Client } from '../../types';

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
          {/* Form inputs */}
          {/* ... */}
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