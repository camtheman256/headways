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
import { Button, Nav, NavLink, NavLinkProps } from "react-bootstrap";
import { useState } from "react";

const CustomNavLink = (props: NavLinkProps) => (
  <NavLink
    {...props}
    href={useHref(props.href ?? "")}
    onClick={useLinkClickHandler(props.href ?? "")}
  />
);

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const themeIcon = { light: "☀️", dark: "🌙" };

  const handleClick = () => {
    const newValue = theme === "light" ? "dark" : "light";
    setTheme(newValue);
    document
      .getElementsByTagName("html")[0]
      .setAttribute("data-bs-theme", newValue);
  };

  return (
    <Button variant={theme} onClick={handleClick}>
      {themeIcon[theme]}
    </Button>
  );
}

function App() {
  const location = useLocation();

  const navbar = [
    {
      name: "Routes",
      path: "/routes",
    },
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
      <Navbar variant="dark" bg="muni" className="mb-2">
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
          <ThemeToggle />
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
