import { Client } from '@/app/admin/types';
import ClientCard from './ClientCard';

interface ClientListProps {
  clients: Client[];
  activeTab: 'pending' | 'completed';
  onEditClient: (client: Client) => void;
  onPreviousStep: (client: Client) => void;
  onNextStep: (client: Client) => void;
  onMarkAsCompleted: (client: Client) => void;
  onMarkAsPending: (client: Client) => void;
}

export default function ClientList({
  clients,
  activeTab,
  onEditClient,
  onPreviousStep,
  onNextStep,
  onMarkAsCompleted,
  onMarkAsPending
}: ClientListProps) {
  const filteredClients = clients.filter(client => 
    activeTab === 'pending' ? client.status !== 'completed' : client.status === 'completed'
  );

  return (
    <ul className="space-y-4">
      {filteredClients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEditClient}
          onPreviousStep={onPreviousStep}
          onNextStep={onNextStep}
          onMarkAsCompleted={onMarkAsCompleted}
          onMarkAsPending={onMarkAsPending}
        />
      ))}
    </ul>
  );
}