import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Helmet } from "react-helmet";
import "./App.css";
import NearMe from "./app/NearMe";

function App() {
  return (
    <>
      <Helmet>
        <title>Headways</title>
      </Helmet>
      <Navbar variant="dark" bg="muni">
        <Container>
          <Navbar.Brand>Headways</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <NearMe />
      </Container>
    </>
  );
}

export default App;
