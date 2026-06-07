export interface MapDetail {
  name: string;
  highway_type: string;
  highway_caption?: string;
  sidewalk: string;
  sidewalk_caption?: string;
  sidewalk_right: string;
  sidewalk_left: string;
  sidewalk_both: string;
  coordinates: [number, number][];
  closest_lat: number;
  closest_lon: number;
  score: number;
}

export interface MapMarker {
  closest_lat: number;
  closest_lon: number;
  score: number;
}

export const getColorByScore = (score: number): string => {
  switch (score) {
    case 1:
      return "#10B981";
    case 2:
      return "#FBBF24";
    case 3:
      return "#F97316";
    case 4:
      return "#EF4444";
    default:
      return "#808080";
  }
};

export const getMapMarkers = (mapDetails: MapDetail[], markerLimit = 10): MapMarker[] => {
  return [...mapDetails]
    .sort((a, b) => b.score - a.score)
    .slice(0, markerLimit)
    .map(({ closest_lat, closest_lon, score }) => ({
      closest_lat,
      closest_lon,
      score,
    }));
};
