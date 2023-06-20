import type {
  NearMeStop,
  TransitLandStop,
  TransitLandStopsResponse,
} from "../../types";

const STOPS_ROUTE = "https://transit.land/api/v2/rest/stops";

export const onRequestGetReal: PagesFunction = async (context) => {
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
    served_by_onestop_ids: "o-9q8y-sfmta,o-9q9-bart",
    apikey: apiKey,
  });
  const stops = await continuouslyFetchStops(`${STOPS_ROUTE}?${requestParams}`);

  return Response.json(
    findClosestStops(stops, parseFloat(lat), parseFloat(lon))
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

const findClosestStops = (stops: TransitLandStop[], lat: number, lon: number) =>
  stops
    .map(
      (stop): NearMeStop => ({
        stop,
        distAway: calculateDistance(
          lat,
          lon,
          stop.geometry.coordinates[1],
          stop.geometry.coordinates[0]
        ),
      })
    )
    .sort((a, b) => a.distAway - b.distAway)
    .slice(0, 10);

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371000; // Radius of the Earth in kilometers

  // Convert latitude and longitude values from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences between the latitudes and longitudes
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Apply the Haversine formula
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Return fake data to not break my API usage
export const onRequestGet: PagesFunction = async (context) => Response.json([
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.393259,
                  37.788404
              ],
              "type": "Point"
          },
          "id": 536310075,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyz5vqm-folsomst~bealest",
          "parent": null,
          "platform_code": null,
          "stop_code": "18002",
          "stop_desc": "",
          "stop_id": "18002",
          "stop_name": "Folsom St & Beale St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/18002",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 69.77037536248355
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.391905,
                  37.789509
              ],
              "type": "Point"
          },
          "id": 536310664,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyzkgvg-mainst~folsomst",
          "parent": null,
          "platform_code": null,
          "stop_code": "17992",
          "stop_desc": "",
          "stop_id": "17992",
          "stop_name": "Main St & Folsom St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/17992",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 120.13879168880456
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.394326,
                  37.787316
              ],
              "type": "Point"
          },
          "id": 536310058,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyygpj6-folsomst~1stst",
          "parent": null,
          "platform_code": null,
          "stop_code": "14655",
          "stop_desc": "",
          "stop_id": "14655",
          "stop_name": "Folsom St & 1st St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/14655",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 210.91062140853685
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.391091,
                  37.790098
              ],
              "type": "Point"
          },
          "id": 536311626,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyzmx2b-spearst~folsomst",
          "parent": null,
          "platform_code": null,
          "stop_code": "17995",
          "stop_desc": "",
          "stop_id": "17995",
          "stop_name": "Spear St & Folsom St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/17995",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 212.9597687656131
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.395372963626,
                  37.7900720641425
              ],
              "type": "Point"
          },
          "id": 536308582,
          "level": {
              "level_id": "mtc:salesforce-transit-center-street",
              "level_index": 0,
              "level_name": "Street"
          },
          "location_type": 0,
          "onestop_id": "s-9q8yyz6rjh-transitcenterbayd",
          "parent": null,
          "platform_code": null,
          "stop_code": "17916",
          "stop_desc": "",
          "stop_id": "17916",
          "stop_name": "Transit Center Bay D",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/17916",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 306.62280326397445
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.395493,
                  37.789957
              ],
              "type": "Point"
          },
          "id": 536308581,
          "level": {
              "level_id": "mtc:salesforce-transit-center-street",
              "level_index": 0,
              "level_name": "Street"
          },
          "location_type": 0,
          "onestop_id": "s-9q8yyz6q6q-transitcenterbayc",
          "parent": null,
          "platform_code": null,
          "stop_code": "17915",
          "stop_desc": "",
          "stop_id": "17915",
          "stop_name": "Transit Center Bay C",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/17915",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 308.64793609064935
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.395493,
                  37.790073
              ],
              "type": "Point"
          },
          "id": 536308583,
          "level": {
              "level_id": "mtc:salesforce-transit-center-street",
              "level_index": 0,
              "level_name": "Street"
          },
          "location_type": 0,
          "onestop_id": "s-9q8yyz6r4k-transitcenterbaye",
          "parent": null,
          "platform_code": null,
          "stop_code": "17917",
          "stop_desc": "",
          "stop_id": "17917",
          "stop_name": "Transit Center Bay E",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/17917",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 315.47693646728567
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.393956,
                  37.791116
              ],
              "type": "Point"
          },
          "id": 536310665,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyzemnn-mainst~howardst",
          "parent": null,
          "platform_code": null,
          "stop_code": "15334",
          "stop_desc": "",
          "stop_id": "15334",
          "stop_name": "Main St & Howard St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/15334",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 315.5013510289711
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.389898,
                  37.790561
              ],
              "type": "Point"
          },
          "id": 536311807,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyzw3ux-theembarcadero~folsomst",
          "parent": null,
          "platform_code": null,
          "stop_code": "14511",
          "stop_desc": "",
          "stop_id": "14511",
          "stop_name": "The Embarcadero & Folsom St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/14511",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 320.25616361613635
  },
  {
      "stop": {
          "feed_version": {
              "feed": {
                  "id": 4057,
                  "onestop_id": "f-sf~bay~area~rg"
              },
              "fetched_at": "2023-06-19T13:00:46.975531Z",
              "id": 337140,
              "sha1": "d527fafdc5e827b538f33e02baec187123043a21"
          },
          "geometry": {
              "coordinates": [
                  -122.389692,
                  37.790481
              ],
              "type": "Point"
          },
          "id": 536311809,
          "level": null,
          "location_type": 0,
          "onestop_id": "s-9q8yyzw992-theembarcadero~folsomst",
          "parent": null,
          "platform_code": null,
          "stop_code": "14509",
          "stop_desc": "",
          "stop_id": "14509",
          "stop_name": "The Embarcadero & Folsom St",
          "stop_timezone": "America/Los_Angeles",
          "stop_url": "https://www.sfmta.com/14509",
          "tts_stop_name": null,
          "wheelchair_boarding": 0,
          "zone_id": ""
      },
      "distAway": 327.36624405869037
  }
])