export const ActivityImg = ({ polyline }: { polyline: string }) => {
  const STROKEWIDTH = 3;
  const STROKECOLOR = "f44";
  const STROKEOPACITY = 1;
  
  const POLYLINE_UNSAFE = polyline;
  
  const POLYLINE = encodeURIComponent(POLYLINE_UNSAFE);

  const USERNAME = "mapbox";
  const STYLE_ID = "streets-v12";
  const OVERLAY = `path-${STROKEWIDTH}+${STROKECOLOR}-${STROKEOPACITY}(${POLYLINE})`;
  const OTHER = "auto";
  const WIDTH = 500;
  const HEIGHT = 300;
  
  const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

  const mapboxImageUrl = `https://api.mapbox.com/styles/v1/${USERNAME}/${STYLE_ID}/static/${OVERLAY}/${OTHER}/${WIDTH}x${HEIGHT}?access_token=${ACCESS_TOKEN}`;

  return (
    <img
      className="w-full h-full object-contain"
      src={mapboxImageUrl}
      alt="Mapbox static route overlay"
    />
  );
}