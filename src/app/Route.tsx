import { useEffect, useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { NearMeStop, RouteApiResponse, TransitLandRoute } from "../../types";
import { LocationError } from "../components/LocationError";
import { RouteBadge } from "../components/RouteBadge";
import { Stop } from "../components/Stop";

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

  useEffect(() => {
    setNearMeStops(findNNearestStops(2, route?.stops ?? []));
  }, [route]);

  if (location === undefined) return <LocationError />;

  return (
    <>
      {route !== undefined ? (
        <>
          <Helmet>
            <title>
              {route.route.route_short_name} {route.route.route_long_name} -
              Headways
            </title>
            <link rel="apple-touch-icon" href={iconCanvasUrl(route.route)} />
          </Helmet>
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

const findNNearestStops = (n: number, stops: NearMeStop[]) =>
  stops
    .slice()
    .sort((a, b) => a.distAway - b.distAway)
    .slice(0, n);

const iconCanvasUrl = (route: TransitLandRoute) => {
  const canvas = document.createElement("canvas");
  canvas.height = 512;
  canvas.width = 512;
  const context = canvas.getContext("2d");
  if (context === null) return;
  context.fillStyle = `#${route.route_color}`;
  context.fillRect(0, 0, 512, 512);
  context.font = "bold 250pt sans-serif";
  context.fillStyle = `#${route.route_text_color}`;
  context.fillText(route.route_short_name, 50, 500);
  return context.canvas.toDataURL("image/png");
};
