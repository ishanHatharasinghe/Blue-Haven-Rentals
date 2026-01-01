import Home from "../pages/landing-pages/Home";
import About from "../pages/landing-pages/About";
import Categories from "../pages/landing-pages/Categories";
import Location from "../pages/landing-pages/Location";
import PostAdd from "../pages/landing-pages/PostAdd";

const LandingPage = () => {
  return (
    <div>
      <Home />
      <About />
      <Categories />
      <Location />
      <PostAdd />
    </div>
  );
};

export default LandingPage;
