import { useEffect, useState } from "react";
import type {
  TransitLandStop,
  NearMeStop,
  TransitLandDeparture,
} from "../../types";
import { Badge, Col, ListGroup, Row, Spinner } from "react-bootstrap";

export default function NearMe() {
  const [location, setLocation] = useState<GeolocationPosition>();
  const [stops, setStops] = useState<NearMeStop[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => setLocation(p), null, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (location === undefined) return;
    fetch(
      `/api/stops?lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    )
      .then((r) => r.json())
      .then((d) => setStops(d));
  }, [location]);

  if (!location) return <LocationError />;

  return (
    <>
      <h1>Nearby Stops</h1>
      <ListGroup>
        {stops.map((s, i) => <Stop key={i} stop={s} />)}
      </ListGroup>
    </>
  );
}

const LocationError = () => (
  <div>
    <h1>Please enable your location.</h1>
    <p>Headways uses your location to find stops near you.</p>
  </div>
);

function Stop(props: { stop: NearMeStop }) {
  const [departures, setDepartures] = useState<TransitLandStop>();

  useEffect(() => {
    fetch(`/api/departures?id=${props.stop.stop.id}`)
      .then((r) => r.json())
      .then((d) => setDepartures(d.stops[0]));
  }, []);

  return (
    <ListGroup.Item>
      <Row>
        <Col>
          <h5>{props.stop.stop.stop_name}</h5>
          <small className="text-muted">
            {Math.round(props.stop.distAway)}m
          </small> <br />
          <small>
            Running every{" "}
            {departures && <b>{findFrequency(departures.departures ?? [])}</b>} mins
          </small>
        </Col>
        <Col>
          <Row>
            {departures ? ( departures.departures?.length ? 
              departures.departures?.map((d, i) => (
                <Departure data={d} key={i} />
              )) : <p className="text-muted">No departures.</p>
            ) : (
              <Spinner />
            )}
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

function Departure(props: { data: TransitLandDeparture }) {
  const route = props.data.trip.route;
  let minsRemaining = props.data.departure_time;
  if (props.data.departure.estimated_utc !== null) {
    const departure = new Date(props.data.departure.estimated_utc).getTime();
    const now = Date.now();
    minsRemaining = Math.floor((departure - now) / 60000).toString();
  }
  return (
    <Col>
      <Badge
        style={{
          backgroundColor: `#${route.route_color}`,
          color: `#${route.route_text_color}`,
        }}
        bg="none"
      >
        {props.data.trip.route.route_short_name}
      </Badge>
      <h5 className={props.data.departure.estimated_utc ? '' : 'text-muted'}>{minsRemaining}</h5>
      <small>{props.data.trip.trip_headsign}</small>
    </Col>
  );
}

function findFrequency(departures: TransitLandDeparture[]) {
  const estimatedDepartures = departures.filter(d => d.departure.estimated_utc !== null)
  let gap = 0;
  for (let i = 1; i < estimatedDepartures.length; i++) {
    gap +=
      new Date(estimatedDepartures[i].departure.estimated_utc ?? '').getTime() -
      new Date(estimatedDepartures[i - 1].departure.estimated_utc ?? '').getTime();
  }
  return Math.round(gap / 60000 / (estimatedDepartures.length - 1));
}
