import { FormEvent, useState } from "react";
import AgencySelector from "../components/AgencySelector";
import { AGENCIES } from "../data";
import { Badge, Card, Col, Form, Row } from "react-bootstrap";
import { TransitLandRoute, TransitLandRoutesResponse } from "../../types";

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
  return (
    <Row className="g-4">
      {props.routes.map((r, i) => (
        <Col key={i}>
          <Card>
            <Card.Body>
              <Card.Title>
                <Badge
                  bg="none"
                  style={{
                    backgroundColor: `#${r.route_color}`,
                    color: `#${r.route_text_color}`,
                  }}
                >
                  {r.route_short_name}
                </Badge>
              </Card.Title>
              <Card.Subtitle>{r.route_long_name}</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
