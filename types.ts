export type TransitLandStopsResponse = {
  stops: TransitLandStop[];
  meta?: {
    after: number;
    next: string;
  };
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
  stop: TransitLandStop,
  distAway: number
}

type TransitLandDeparture = {
  arrival_time: string;
  departure_time: string;
  arrival: TransitLandTimeAdjustment;
  departure: TransitLandTimeAdjustment;
  stop_headsign: string;
  trip: TransitLandTrip;
};

type TransitLandTimeAdjustment = {
  /** Delay in number of seconds from scheduled */
  delay: number;
  /** Estimated time in local time */
  estimated: string;
  estimated_utc: string;
  scheduled: string;
};

type TransitLandTrip = {
  id: number;
  /** Destination of this trip */
  trip_headsign: string;
  route: TransitLandRoute;
};

type TransitLandRoute = {
  id: number;
  route_short_name: string;
  route_long_name: string;
  route_color: string;
};
