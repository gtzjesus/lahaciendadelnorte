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
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-red-300 border-t-primary" />
      <h2 className="uppercase text-center text-md text-black">
        finishing up your order! <br />
        hang tight!
      </h2>
    </div>
  );
}
