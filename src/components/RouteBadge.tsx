import { Badge } from "react-bootstrap";
import { TransitLandRoute } from "../../types";

export const RouteBadge = (props: { route: TransitLandRoute }) => (
  <Badge
    bg="none"
    style={{
      backgroundColor: `#${props.route.route_color}`,
      color: `#${props.route.route_text_color}`,
    }}
  >
    {props.route.route_short_name}
  </Badge>
);
