import type { TransitLandStop, TransitLandStopsResponse } from "../../types";
import { sortByClosestStop } from "../utils";

const STOPS_ROUTE = "https://transit.land/api/v2/rest/stops";

export const onRequestGet: PagesFunction = async (context) => {
  const queryString = context.request.url.substring(
    context.request.url.indexOf("?")
  );
  const params = new URLSearchParams(queryString);
  if (!params.has("lat") || !params.has("lon")) {
    return new Response("No lat/lon specified!", { status: 400 });
  }
  const apiKey = context.env["API_KEY"];
  const lat = params.get("lat");
  const lon = params.get("lon");
  const requestParams = new URLSearchParams({
    lat,
    lon,
    radius: "1000",
    limit: "100",
    served_by_onestop_ids: params.get("operators") || "o-9q8y-sfmta,o-9q9-bart",
    apikey: apiKey,
  });
  const stops = await continuouslyFetchStops(`${STOPS_ROUTE}?${requestParams}`);

  return Response.json(
    sortByClosestStop(stops, parseFloat(lat), parseFloat(lon))
  );
};

async function continuouslyFetchStops(
  fetchUrl: string
): Promise<TransitLandStop[]> {
  const r = await fetch(fetchUrl);
  const stopsResponse: TransitLandStopsResponse = await r.json();
  const stops = stopsResponse.stops;
  if (stopsResponse.meta?.next) {
    stops.push(...(await continuouslyFetchStops(stopsResponse.meta?.next)));
  }
  return stops;
}
