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
  context.fillRect(0, 0, canvas.height, canvas.width);

  context.fillStyle = `#${route.route_text_color}`;
  for (const fontSize of [250, 168, 72, 48]) {
    context.font = `bold ${fontSize}pt sans-serif`;

    const fontBox = context.measureText(route.route_short_name);
    const [fontHeight, fontWidth] = [
      fontBox.actualBoundingBoxAscent - fontBox.actualBoundingBoxDescent,
      fontBox.actualBoundingBoxRight - fontBox.actualBoundingBoxLeft,
    ];

    // Paint font if size looks good
    if (canvas.height - fontHeight > 50 && canvas.width - fontWidth > 50) {
      context.fillText(
        route.route_short_name,
        (canvas.width - fontWidth) / 2,
        canvas.height - (canvas.height - fontHeight) / 2
      );
      break;
    }
  }

  // paintHeadwaysBranding(context);

  return context.canvas.toDataURL("image/png");
};

const paintHeadwaysBranding = (context: CanvasRenderingContext2D) => {
  // TODO: this needs some work lol, too small
  context.fillStyle = "#fff";
  context.fillRect(0, 0, 230, 50);
  context.fillStyle = "#000";
  context.font = "bold 32pt sans-serif";
  context.fillText("Headways", 5, 40);
};
