import { NavLink } from "react-router-dom";

const Test = () => {
  return (
    <>
      <div className="container mt-5">
        <h1 className="display-1 text-center">Test Page !</h1>
        <NavLink to="/about" className="btn btn-primary">
          About Page
        </NavLink>
      </div>
    </>
  );
};

export default Test;
