import { Client } from '../types';
import { getClientStepText } from '../utils';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onPreviousStep: (client: Client) => void;
  onNextStep: (client: Client) => void;
  onMarkAsCompleted: (client: Client) => void;
  onMarkAsPending: (client: Client) => void;
}

export default function ClientCard({
  client,
  onEdit,
  onPreviousStep,
  onNextStep,
  onMarkAsCompleted,
  onMarkAsPending
}: ClientCardProps) {
  return (
    <li className="p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg shadow-xl">
      {/* Client information display */}
      <p className="text-white"><strong>Name:</strong> {client.name}</p>
      {/* ... other client information ... */}
      <div className="mt-4 border border-white p-4 rounded-lg">
        {getClientStepText(client)}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(client)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Edit
        </button>
        {client.status !== 'completed' ? (
          <>
            <button
              onClick={() => onPreviousStep(client)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              disabled={client.step === 1}
            >
              Previous Step
            </button>
            <button
              onClick={() => onNextStep(client)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition duration-300"
              disabled={client.step === 10}
            >
              Next Step
            </button>
            <button
              onClick={() => onMarkAsCompleted(client)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Mark as Completed
            </button>
          </>
        ) : (
          <button
            onClick={() => onMarkAsPending(client)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Mark as Pending
          </button>
        )}
      </div>
    </li>
  );
}