'use client';

export default function DeleteButton() {
  return (
    <form action="/api/delete-all-orders" method="POST">
      <button
        type="submit"
        className="mb-6 px-4 py-2 bg-red-600 text-white text-sm uppercase rounded hover:bg-red-700"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete ALL orders?')) {
            e.preventDefault();
          }
        }}
      >
        Delete All Orders
      </button>
    </form>
  );
}
