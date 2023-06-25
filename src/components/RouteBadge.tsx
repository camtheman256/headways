import { Badge } from "react-bootstrap";
import { TransitLandRoute } from "../../types";

export const RouteBadge = (props: { route: TransitLandRoute }) => (
  <Badge
    bg="none"
    style={{
      backgroundColor: `#${props.route.route_color || "333"}`,
      color: `#${props.route.route_text_color || "fff"}`,
    }}
  >
    {props.route.route_short_name}
  </Badge>
);
