const STOPS_ROUTE = "https://transit.land/api/v2/rest/stops";

export const onRequestGet: PagesFunction = async (context) => {
  const queryString = context.request.url.substring(
    context.request.url.indexOf("?")
  );
  const params = new URLSearchParams(queryString);
  if (!params.has("id")) {
    return new Response("No stop id specified!", { status: 400 });
  }
  const apiKey = context.env["API_KEY"];
  const requestParams = new URLSearchParams({ apikey: apiKey });

  return fetch(
    `${STOPS_ROUTE}/${params.get("id")}/departures?${requestParams}`
  );
};
