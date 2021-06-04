import { NavLink } from "react-router-dom";
import { GrStar } from "react-icons/gr";
import { classes } from "../classes";

const Footer = () => {
  return (
    <div className="mb-10">
      <div className="max-w-3xl mx-auto border-highlight space-x-5 text-center text-xs uppercase tracking-widest border-t-4 border-b-4 py-3">
        <NavLink to={"/"} exact={true} activeClassName={classes.activeNav}>
          {" "}
          Full Timeline
        </NavLink>
        <NavLink
          to={"/choropleth-map"}
          exact={true}
          activeClassName={classes.activeNav}
        >
          Choropleth Map
        </NavLink>
        <NavLink
          to={"/sentiments"}
          exact={true}
          activeClassName={classes.activeNav}
        >
          Sentiment Analysis
        </NavLink>
        <NavLink to={"/race"} exact={true} activeClassName={classes.activeNav}>
          Hashtags Race
        </NavLink>
        <NavLink
          to={"/evolution-map"}
          exact={true}
          activeClassName={classes.activeNav}
        >
          Evolution Map
        </NavLink>
        <NavLink
          to={"/capitol"}
          exact={true}
          activeClassName={classes.activeNav}
        >
          Riots
        </NavLink>
      </div>
      <div className="max-w-3xl text-sm  mx-auto text-center my-4">
        Made by{" "}
        <a href="https://github.com/iulianav" className={classes.link}>
          Iuliana Voinea
        </a>{" "}
        ,{" "}
        <a href="https://github.com/n-poulsen" className={classes.link}>
          Niels Poulsen
        </a>{" "}
        and{" "}
        <a href="https://github.com/jeanchambras" className={classes.link}>
          Jean Chambras
        </a>{" "}
        for the course{" "}
        <a
          href="https://edu.epfl.ch/coursebook/en/data-visualization-COM-480"
          className={classes.link}
        >
          Data visualization (COM-480 @ EPFL)
        </a>
        .
      </div>
    </div>
  );
};

export default Footer;
