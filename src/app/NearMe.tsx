import { useEffect, useState } from "react";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import type { NearMeStop } from "../../types";
import AgencySelector from "../components/AgencySelector";
import { Stop } from "../components/Stop";
import { LocationError } from "../components/LocationError";

export default function NearMe() {
  const numberOfStops = 10;
  const [location, setLocation] = useState<GeolocationPosition>();
  const [stops, setStops] = useState<NearMeStop[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [agency, setAgency] = useState<string>();
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => setLocation(p), null, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (location === undefined || !launched) return;
    fetch(
      `/api/stops?lat=${location.coords.latitude}&lon=${location.coords.longitude}&operators=${agency}`
    )
      .then((r) => r.json())
      .then((d) => setStops(d.slice(0, numberOfStops)))
      .then(() => setLoaded(true));
  }, [location, agency, launched]);

  if (!location) return <LocationError />;

  return (
    <>
      <h1>Nearby Stops</h1>
      <AgencySelector setAgency={setAgency} />
      {launched ? (
        loaded ? (
          <ListGroup>
            {stops.map((s, i) => (
              <Stop key={i} stop={s} />
            ))}
          </ListGroup>
        ) : (
          <div>
            <Spinner /> Loading stops near you
          </div>
        )
      ) : (
        <Button size="lg" onClick={() => setLaunched(true)}>
          Find stops near me
        </Button>
      )}
    </>
  );
}
