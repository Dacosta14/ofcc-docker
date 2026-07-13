import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `rounded px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-red-900/30 text-red-500"
        : "text-gray-300 hover:bg-gray-900 hover:text-red-500"
    }`;

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>

        <NavLink to="/clientes" className={linkClass}>
          Clientes
        </NavLink>

        <NavLink to="/ordens" className={linkClass}>
          Ordens
        </NavLink>

        <NavLink to="/pecas" className={linkClass}>
          Peças
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
