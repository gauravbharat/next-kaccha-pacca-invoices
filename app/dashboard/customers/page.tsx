import { Metadata } from 'next';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Customers',
};

export default function CustomerPage() {
  return (
    <div className="flex items-center space-x-2">
      Customer Page - under construction <HandRaisedIcon className="h-4 w-4" />
    </div>
  );
}
