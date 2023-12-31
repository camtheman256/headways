export type TransitLandStopsResponse = {
  stops: TransitLandStop[];
  meta?: TransitLandMeta;
};

export type TransitLandRoutesResponse = {
  routes: TransitLandRoute[];
  meta?: TransitLandMeta;
};

type TransitLandMeta = {
  after: number;
  next: string;
};

export type TransitLandStop = {
  geometry: {
    coordinates: number[];
    type: "Point";
  };
  id: number;
  stop_name: string;
  departures?: TransitLandDeparture[];
};

export type NearMeStop = {
  stop: TransitLandStop;
  distAway: number;
};

export type RouteApiResponse = {
  route: TransitLandRoute;
  stops: NearMeStop[];
};

export type TransitLandDeparture = {
  arrival_time: string;
  departure_time: string;
  arrival: TransitLandTimeAdjustment;
  departure: TransitLandTimeAdjustment;
  stop_headsign: string;
  trip: TransitLandTrip;
};

export type TransitLandTimeAdjustment = {
  /** Delay in number of seconds from scheduled */
  delay: number;
  /** Estimated time in local time */
  estimated: string | null;
  estimated_utc: string | null;
  scheduled: string;
};

export type TransitLandTrip = {
  id: number;
  /** Destination of this trip */
  trip_headsign: string;
  route: TransitLandRoute;
};

export type TransitLandRoute = {
  id: number;
  route_short_name: string;
  route_long_name: string;
  route_color: string;
  route_text_color: string;
  route_url: string;
  route_stops?: {
    stop: TransitLandStop;
  }[];
};
