import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <div className="display-1">404</div>
        <h1 className="mb-3">Page Not Found</h1>
        <NavLink to="/" className="btn btn-primary">
          Home Page
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
