// components/common/Loader.tsx

/**
 * Loader Component
 *
 * Displays a centered loading spinner. Can be reused across pages or components.
 *
 * @returns {JSX.Element} A full-screen spinner UI.
 */
export default function Loader() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-white  border-t-primary" />
      <h2 className="uppercase text-sm text-white mt-4">Loading...</h2>
    </div>
  );
}
