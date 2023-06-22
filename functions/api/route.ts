const ROUTES_ROUTE = "https://transit.land/api/v2/rest/routes";

export const onRequestGet: PagesFunction = async (context) => {
  const queryString = context.request.url.substring(
    context.request.url.indexOf("?")
  );
  const params = new URLSearchParams(queryString);
  if (!params.has("id")) {
    return new Response("No route id specified!", { status: 400 });
  }
  const apiKey = context.env["API_KEY"];
  const requestParams = new URLSearchParams({
    apikey: apiKey,
    include_geometry: "false",
  });

  return fetch(`${ROUTES_ROUTE}/${params.get("id")}?${requestParams}`);
};
