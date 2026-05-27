export const ActivityImgAlt = ({ polyline }: { polyline: string }) => {
  const mapboxImageUrl = `/api/mapbox-static-alt?polyline=${encodeURIComponent(polyline)}`;

  return (
    <img
      className="w-full h-full object-contain"
      src={mapboxImageUrl}
      alt="Mapbox static route overlay"
    />
  );
}
