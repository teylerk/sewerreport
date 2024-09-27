import { Client } from './types';

export const allowedEmails = [
  "teylersf@gmail.com",
  "kalintrenchless@gmail.com",
  "spokanerooter@gmail.com",
];

export const generatePin = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getClientStepText = (client: Client): string => {
  switch (client.step) {
    case 1:
      return "Initial Contact";
    case 2:
      return "Site Visit Scheduled";
    case 3:
      return "Site Visit Completed";
    case 4:
      return "Bid Sent";
    case 5:
      return "Bid Accepted";
    case 6:
      return "Permit Submitted";
    case 7:
      return "Permit Approved";
    case 8:
      return "Work Scheduled";
    case 9:
      return "Work in Progress";
    case 10:
      return "Work Completed";
    default:
      return "Unknown Step";
  }
};