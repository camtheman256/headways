import { useEffect, useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NearMeStop, RouteApiResponse, TransitLandStop } from "../../types";
import { RouteBadge } from "../components/RouteBadge";
import { Stop } from "../components/Stop";
import { LocationError } from "../components/LocationError";

export default function Route() {
  const { routeId } = useParams();
  const [route, setRoute] = useState<RouteApiResponse>();
  const [location, setLocation] = useState<GeolocationPosition>();
  const [nearMeStops, setNearMeStops] = useState<NearMeStop[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => setLocation(p));
  }, []);

  useEffect(() => {
    if (location === undefined || routeId === undefined) return;
    const params = new URLSearchParams({
      id: routeId,
      lat: location.coords.latitude.toString(),
      lon: location.coords.longitude.toString(),
    });
    fetch(`/api/route?${params}`)
      .then((r) => r.json())
      .then((d) => setRoute(d));
  }, [routeId, location]);

  if (location === undefined) return <LocationError />;

  return (
    <>
      {route !== undefined ? (
        <>
          <h1>
            <RouteBadge route={route.route} /> {route.route.route_long_name}
          </h1>
          <h2>Near Me</h2>
          <ListGroup>
            {nearMeStops.map((s, i) => (
              <Stop
                key={i}
                stop={s}
                filterRoute={route.route.id}
                autoLoad={true}
              />
            ))}
          </ListGroup>
          <h2>Other Stops</h2>
          <ListGroup>
            {route.stops.map((s, i) => (
              <Stop key={i} stop={s} filterRoute={route.route.id} />
            ))}
          </ListGroup>
        </>
      ) : (
        <div>
          <Spinner className="me-2" />
          <span>Loading route</span>
        </div>
      )}
    </>
  );
}
