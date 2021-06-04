import { useEffect, useState } from "react";
import classnames from "classnames";
import {classes} from '../classes'
import ChoroplethCountyMap from "./choropleth_map";
import map_usa_counties from "./counties-albers-10m.json";
import county_data from "./videos_per_county.json";

const Map = ({ mapType, year, week }) => {
  const [geodata, setGeodata] = useState(null);
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    setGeodata(map_usa_counties);
    setLoc(county_data);
  }, []);

  return (
    <div id="geolocation" className="my-8">
      <h2 className={classnames(classes.title)}>Parler Video Geolocation</h2>
      <p className={classnames(classes.paragraph, "drop-caps")}>
        After the January 6th riots, hacktivists, knowing that Parler was likely 
        to get taken down and that it was used in part to organize them, started 
        to scrap the Parler API to create an archive of the data. This dataset 
        includes videos with geolocation metadata. The obtained location data for 
        more than 68'000 videos, most of which taken between 2020 and January
        10th, 2021.
      </p>
      <p className={classnames(classes.paragraph)}>
        We gathered this data for 2020 and after, grouping it by county. Below is
        a map showing the number of videos uploaded from each county in the United
        States of America. The exact values can be obtained by hovering over a specific
        region.
      </p>
      <div className="max-w-7xl mx-auto px-10">
      <ChoroplethCountyMap geodata={geodata} loc={loc} />
      </div>
    </div>
  );
};

export default Map;
