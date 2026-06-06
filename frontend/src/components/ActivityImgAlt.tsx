import type { MapMarker } from "@/lib/map-details";

export const ActivityImgAlt = ({
  polyline,
  markers,
}: {
  polyline: string;
  markers: MapMarker[];
}) => {
  const params = new URLSearchParams({ polyline });

  if (markers.length) {
    params.set("markers", JSON.stringify(markers));
  }

  const mapboxImageUrl = `/api/mapbox-static-alt?${params.toString()}`;

  return (
    <img
      className="w-full h-full object-contain"
      src={mapboxImageUrl}
      alt="Mapbox static route overlay"
    />
  );
}
