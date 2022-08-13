import { Outlet, NavLink } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <nav className="w-screen h-16 border-b border-neutral-300 flex px-6 py-2 items-center gap-3">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/game">Oyun</Link>
      </nav>
      <main className="px-0 py-4 bg-neutral-200 h-[calc(100vh-80px)] w-screen overflow-auto">
        <Outlet />
      </main>
    </>
  );
}

function Link({ to, children, ...props }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive
            ? "text-black bg-neutral-100 border border-neutral-300"
            : "text-neutral-400 bg-neutral-50 hover:text-neutral-600 border-bg-neutral-100"
        } hover:bg-neutral-200 h-full grid items-center px-6 rounded-lg border hover:border-neutral-400`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

export default MainLayout;
