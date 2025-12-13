import { Route, Routes } from "react-router-dom";
import NotFound from "../../pages/NotFound/NotFound";
import Home from "../../pages/Home/Home";
import MainFrame from "../../containers/Layout/MainFrame/MainFrame";
import Counter from "../../pages/Counter/Counter";

const MainNav = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainFrame />}>
          <Route index element={<Home />} />
          <Route path="/test" element={<Counter />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default MainNav;
