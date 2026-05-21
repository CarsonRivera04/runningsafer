export const ActivityImg = ({ polyline }: { polyline: string }) => {
  const mapboxImageUrl = `/api/mapbox-static?polyline=${encodeURIComponent(polyline)}`;

  return (
    <img
      className="w-full h-full object-contain"
      src={mapboxImageUrl}
      alt="Mapbox static route overlay"
    />
  );
}
