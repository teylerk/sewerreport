export interface Client {
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
  notes: string;
  status: string;
}