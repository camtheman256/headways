import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Helmet } from "react-helmet";
import "./App.css";
import {
  Outlet,
  useLinkClickHandler,
  useHref,
  useLocation,
} from "react-router-dom";
import { Nav, NavLink, NavLinkProps } from "react-bootstrap";

const CustomNavLink = (props: NavLinkProps) => (
  <NavLink
    {...props}
    href={useHref(props.href ?? "")}
    onClick={useLinkClickHandler(props.href ?? "")}
  />
);

function App() {
  const location = useLocation();

  const navbar = [
    {
      name: "About",
      path: "/about",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Headways</title>
      </Helmet>
      <Navbar variant="dark" bg="muni">
        <Container>
          <Navbar.Brand href={useHref("/")} onClick={useLinkClickHandler("/")}>
            Headways
          </Navbar.Brand>
          <Nav className="me-auto">
            {navbar.map((r, i) => (
              <CustomNavLink
                key={i}
                href={r.path}
                active={location.pathname === r.path}
              >
                {r.name}
              </CustomNavLink>
            ))}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
