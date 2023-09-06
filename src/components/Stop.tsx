import { useEffect, useState } from "react";
import { Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { NearMeStop, TransitLandDeparture, TransitLandStop } from "../../types";
import { RouteBadge } from "./RouteBadge";

export function Stop({
  stop,
  filterRoute,
  autoLoad = false,
}: {
  stop: NearMeStop;
  filterRoute?: number;
  autoLoad?: boolean;
}) {
  const [departures, setDepartures] = useState<TransitLandStop>();
  const [fetchedTime, setFetchedTime] = useState<number>();
  const [minsAgo, setMinsAgo] = useState<number>(0);

  useEffect(() => {
    if (autoLoad) {
      fetch(`/api/departures?id=${stop.stop.id}`)
        .then((r) => r.json())
        .then((d) => setDepartures(d.stops[0]))
        .then(() => setFetchedTime(Date.now()));
    }
  }, [stop.stop.id, autoLoad]);

  useEffect(() => {
    if (fetchedTime !== undefined) {
      const timeout = setInterval(
        () => setMinsAgo(Math.round((Date.now() - fetchedTime) / 60000)),
        30000
      );
      return () => clearInterval(timeout);
    }
  }, [fetchedTime]);

  const filteredDepartures = departures?.departures?.filter(
    (d) => !filterRoute || d.trip.route.id === filterRoute
  );

  return (
    <ListGroup.Item>
      <Row>
        <Col>
          <h5>{stop.stop.stop_name}</h5>
          <small className="text-muted">
            {Math.round(stop.distAway)}m
          </small>{" "}
          <br />
          {departures && (
            <small>
              Running every{" "}
              <b>{findFrequency(filteredDepartures ?? []).toString()}</b> mins,
              as of {minsAgo} mins ago
            </small>
          )}
        </Col>
        {departures && (
          <Col>
            <Row>
              {filteredDepartures ? (
                filteredDepartures.length ? (
                  filteredDepartures.map((d, i) => (
                    <Departure data={d} key={i} />
                  ))
                ) : (
                  <p className="text-muted">No departures.</p>
                )
              ) : (
                <Spinner />
              )}
            </Row>
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );
}

function Departure(props: { data: TransitLandDeparture }) {
  const [minsRemaining, setMinsRemaining] = useState<number>();

  useEffect(() => {
    if (props.data.departure.estimated_utc !== null) {
      const departure = new Date(props.data.departure.estimated_utc).getTime();
      const interval = setInterval(
        () => setMinsRemaining(Math.floor((departure - Date.now()) / 60000)),
        30000
      );
      return () => clearInterval(interval);
    }
  }, [props.data.departure.estimated_utc]);
  return (
    <Col>
      <RouteBadge route={props.data.trip.route} />
      <h5 className={props.data.departure.estimated_utc ? "" : "text-muted"}>
        {minsRemaining || props.data.departure_time}
      </h5>
      <small>{props.data.trip.trip_headsign}</small>
    </Col>
  );
}

function findFrequency(departures: TransitLandDeparture[]) {
  const estimatedDepartures = departures.filter(
    (d) => d.departure.estimated_utc !== null
  );
  let gap = 0;
  for (let i = 1; i < estimatedDepartures.length; i++) {
    gap +=
      new Date(estimatedDepartures[i].departure.estimated_utc ?? "").getTime() -
      new Date(
        estimatedDepartures[i - 1].departure.estimated_utc ?? ""
      ).getTime();
  }
  return Math.round(gap / 60000 / (estimatedDepartures.length - 1));
}
