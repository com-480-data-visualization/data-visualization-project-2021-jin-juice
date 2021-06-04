import { NavLink } from "react-router-dom";
import {GrStar} from 'react-icons/gr'
import { classes } from "../classes";

const Navbar = () => {
  return (
    <div className="mb-10">
      <div className="flex max-w-3xl mt-5 justify-center space-x-4 mx-auto">
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
        <GrStar/>
      </div>
      <h1 className="max-w-3xl mx-auto border-highlight border-t-4 mt-4 uppercase tracking-widest text-lg py-3 text-white font-bold text-center ">
        Run for presidency
      </h1>
      <div className="max-w-3xl mx-auto border-highlight space-x-5 text-center text-xs uppercase tracking-widest border-t-4 py-3">
        <NavLink to={"/"} exact={true} activeClassName={classes.activeNav}>
          {" "}
          Full Timeline
        </NavLink>
        <NavLink to={"/choropleth-map"} exact={true} activeClassName={classes.activeNav}>
        Choropleth Map
        </NavLink>
        <NavLink to={"/sentiments"} exact={true} activeClassName={classes.activeNav}>
        Sentiment Analysis
        </NavLink>
        <NavLink to={"/race"} exact={true} activeClassName={classes.activeNav}>
        Hashtags Race
        </NavLink>
        <NavLink to={"/evolution-map"} exact={true} activeClassName={classes.activeNav}>
        Evolution Map
        </NavLink>
        <NavLink to={"/capitol"} exact={true} activeClassName={classes.activeNav}>
        Riots
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
