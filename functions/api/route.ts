import { RouteApiResponse, TransitLandRoutesResponse } from "../../types";
import { measureDistanceToStops } from "../utils";

const ROUTES_ROUTE = "https://transit.land/api/v2/rest/routes";

export const onRequestGet: PagesFunction = async (context) => {
  const queryString = context.request.url.substring(
    context.request.url.indexOf("?")
  );
  const params = new URLSearchParams(queryString);
  if (!params.has("id")) {
    return new Response("No route id specified!", { status: 400 });
  }
  if (!params.has("lat") || !params.has("lon")) {
    return new Response("No lat/lon specified!", { status: 400 });
  }
  const [lat, lon] = [
    parseFloat(params.get("lat")),
    parseFloat(params.get("lon")),
  ];
  const apiKey = context.env["API_KEY"];
  const requestParams = new URLSearchParams({
    apikey: apiKey,
    include_geometry: "false",
  });

  const r = await fetch(`${ROUTES_ROUTE}/${params.get("id")}?${requestParams}`);
  const routeResponse: TransitLandRoutesResponse = await r.json();
  const route = routeResponse.routes[0];
  const stops = measureDistanceToStops(
    route.route_stops.map((s) => s.stop),
    lat,
    lon
  );
  const responseJson: RouteApiResponse = { route, stops };
  return Response.json(responseJson);
};
