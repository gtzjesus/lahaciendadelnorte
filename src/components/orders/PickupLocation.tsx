'use client';

const PickupLocation = () => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 my-4 border border-flag-blue">
      <h2 className="text-sm uppercase text-flag-blue mb-2">
        El paso kaboom pickup location
      </h2>

      <div className="w-full h-64 overflow-hidden">
        <iframe
          title="Pickup Location"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          className="border-0"
          src="https://www.google.com/maps?q=531+Talbot+Ave,+Canutillo,+TX+79835&output=embed"
        />
      </div>

      <a
        href="https://www.google.com/maps/dir/?api=1&destination=531+Talbot+Ave,+Canutillo,+TX+79835"
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 uppercase text-sm block w-full text-center bg-flag-blue text-white font-semibold py-2 transition"
      >
        Get Directions
      </a>
    </div>
  );
};

export default PickupLocation;
