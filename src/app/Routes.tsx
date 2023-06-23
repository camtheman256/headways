import { FormEvent, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TransitLandRoute, TransitLandRoutesResponse } from "../../types";
import AgencySelector from "../components/AgencySelector";
import { RouteBadge } from "../components/RouteBadge";
import { AGENCIES } from "../data";

export default function Routes() {
  const defaultAgency = AGENCIES.SFMTA;
  const [agency, setAgency] = useState<string | undefined>(defaultAgency);
  const [routeSearch, setRouteSearch] = useState("");
  const [routeSearchResult, setRouteSearchResult] =
    useState<TransitLandRoutesResponse>();

  const handleRouteSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      operator: agency ?? defaultAgency,
      search: routeSearch,
    });
    fetch(`/api/routes?${params}`)
      .then((r) => r.json())
      .then((d) => setRouteSearchResult(d));
  };

  return (
    <>
      <h1>Look up a route</h1>
      <AgencySelector
        all={false}
        setAgency={setAgency}
        defaultValue={defaultAgency}
      />
      <Form onSubmit={handleRouteSearch} className="mb-2">
        <Form.Control
          size="lg"
          placeholder="Route"
          name="route"
          value={routeSearch}
          onChange={(e) => setRouteSearch(e.target.value)}
        />
      </Form>
      <RouteGrid routes={routeSearchResult?.routes ?? []} />
    </>
  );
}

function RouteGrid(props: { routes: TransitLandRoute[] }) {
  const navigate = useNavigate();

  return (
    <Row className="g-4">
      {props.routes.map((r, i) => (
        <Col key={i}>
          <Card onClick={() => navigate(`/routes/${r.id}`)}>
            <Card.Body>
              <Card.Title>
                <RouteBadge route={r} />
              </Card.Title>
              <Card.Subtitle>{r.route_long_name}</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
