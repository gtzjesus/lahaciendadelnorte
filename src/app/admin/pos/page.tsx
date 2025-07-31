import POSClient from '@/app/admin/pos/POSClient';

export default function POSPage() {
  // This is now a server component with no client-side hooks or state.
  // You can optionally fetch data here and pass as props to POSClient.

  return <POSClient />;
}
