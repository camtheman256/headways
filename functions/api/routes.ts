const STOPS_ROUTE = "https://transit.land/api/v2/rest/routes";

export const onRequestGet: PagesFunction = async (context) => {
  const queryString = context.request.url.substring(
    context.request.url.indexOf("?")
  );
  const params = new URLSearchParams(queryString);
  if (!params.has("operator")) {
    return new Response("No operator specified!", { status: 400 });
  }
  const apiKey = context.env["API_KEY"];
  const requestParams = new URLSearchParams({
    apikey: apiKey,
    operator_onestop_id: params.get("operator"),
    search: params.get("search"),
  });

  return fetch(`${STOPS_ROUTE}?${requestParams}`);
};
