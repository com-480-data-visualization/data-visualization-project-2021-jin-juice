import classnames from "classnames";
import { useRef } from "react";
import { classes } from "../classes";
import CMap from "../circle_map/circle_map_slider";
import Map from "../map/Map";
import Race from "../race/Race";
import Text from "../text/Text";
import Separator from "./Separator";
import Capitol from "../capitol/Capitol"

const Timeline = () => {
  const raceRef = useRef();

  return (
    <div className="overflow-visible">
      <p className={classnames(classes.paragraph, "drop-caps")}>
        The core of our project is to compare several datasets at different
        times during the US campaign up until the Capitol riots. We want to
        illustrate how these datasets interact with each other. An example of
        this is showing the influence of the Trump campaign’s communication
        (Trump’s speeches, tweets, ...) on the behavior of his parler
        supporters, and show the influence of Parler users on Trump’s behavior.
        As some of our visualizations are quite heavy, we include links in the
        navigation bar to open pages with a single visualization, which usually
        run smoother.
      </p>
      <Map mapType="choropleth" />
      <Text />
      <Race />
      <CMap />
      <Capitol/>
    </div>
  );
};

export default Timeline;
