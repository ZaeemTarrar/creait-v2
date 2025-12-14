import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="container mt-5">
        <h1 className="display-1 text-center">Home Page !</h1>
        <NavLink to="/counter" className="btn btn-primary">
          Counter Page
        </NavLink>
        &nbsp;&nbsp;
        <NavLink to="/test" className="btn btn-primary">
          Test Page
        </NavLink>
      </div>
    </>
  );
};

export default Home;
