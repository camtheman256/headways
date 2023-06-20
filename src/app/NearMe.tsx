import { useEffect, useState } from "react";
import { TransitLandStop, type NearMeStop } from "../../types";
import { Col, ListGroup, Row } from "react-bootstrap";

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
        {stops.map((s, i) => <Stop key={i} stop={s} />).slice(0, 3)}
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
          </small>
        </Col>
        <Col>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
