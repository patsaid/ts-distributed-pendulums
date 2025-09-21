import { GiPendulumSwing } from "react-icons/gi";

export default function Header() {
  return (
    <header>
      <span data-testid="pendulum-icon">
        <GiPendulumSwing size={60} />
      </span>
      <h1>Distributed Pendulums</h1>
    </header>
  );
}
