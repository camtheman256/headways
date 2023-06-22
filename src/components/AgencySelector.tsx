import { Form } from "react-bootstrap";
import { AGENCIES } from "../data";

type AgencySelectorProps = {
  setAgency: (agency: string | undefined) => void;
  all?: boolean;
  defaultValue?: string;
};

export default function AgencySelector({
  setAgency,
  all = true,
  defaultValue,
}: AgencySelectorProps) {
  return (
    <Form className="mb-2">
      {all && (
        <Form.Check
          id="all"
          value="all"
          label="All"
          type="radio"
          name="agency"
          defaultChecked={defaultValue !== undefined}
          onChange={() => setAgency(undefined)}
          inline
        />
      )}
      {Object.entries(AGENCIES).map(([agency, id], i) => (
        <Form.Check
          key={i}
          id={id}
          value={id}
          label={agency}
          name="agency"
          type="radio"
          onChange={(e) => setAgency(e.target.value)}
          defaultChecked={id === defaultValue}
          inline
        />
      ))}
    </Form>
  );
}
