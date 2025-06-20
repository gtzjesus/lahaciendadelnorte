/**
 * NoResults component displays a message when no search results are found.
 */
const NoResults = ({ query }: { query: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center text-white">
      <h1 className="text-2xl font-bold mb-6">
        No results were found for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-lg text-gray-300">Please try a different search.</p>
    </div>
  );
};

export default NoResults;
