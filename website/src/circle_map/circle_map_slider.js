import classnames from "classnames";
import { useEffect, useState, useRef } from "react";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Stop from "@material-ui/icons/Stop";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { classes } from "../classes";
import useResizable from "../hooks/useResizable";
import map_usa_counties from "./counties-albers-10m.json";
import weekly_county_data from "./videos_per_county_per_week.json";
import generate_map from "./generate_map";
import update_datapoints from "./update_circles";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { BsFillPlayFill, BsStopFill } from "react-icons/bs";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const IOSSlider = withStyles({
  root: {
    color: "#cf364a",
    height: 2,
    padding: "15px 0",
  },
  thumb: {
    height: 22,
    width: 22,
    backgroundColor: "#fff",
    boxShadow: iOSBoxShadow,
    marginTop: -11,
    marginLeft: -11,
    "&:focus, &:hover, &$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 12px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#fff",
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#cf364a",
  },
  mark: {
    backgroundColor: "#cf364a",
    height: 8,
    width: 2,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
  markLabel: {
    color: "white",
    fontWeight: "bold",
    marginTop: "1rem",
  },
})(Slider);

//  Week  1 2020: 30.12.2019 - 05.01.2020
//  Week 26 2020: 22.06.2020 - 28.06.2020
//  Week 40 2020: 28.09.2020 - 04.10.2020
//  Week 45 2020: 02.11.2020 - 08.11.2020
//  Week 50 2020: 07.12.2020 - 13.12.2020
//  Week 53 2020: 28.12.2020 - 03.01.2021
//  Week  1 2021: 04.01.2021 - 10.01.2021
const marks = [
  {
    value: 40,
    label: "October",
  },
  {
    value: 45,
    label: "November",
  },
  {
    value: 49,
    label: "December",
  },
  {
    value: 54,
    label: "Riots",
  },
];

function valuetext(value) {
  return `Week ${value + 1}`;
}

const CMap = ({ className }) => {
  const svgRef = useRef();
  const pointsRef = useRef();
  const mapRef = useRef();
  const rootRef = useRef();
  const dimmensions = useResizable(rootRef);
  const svg = d3.select(svgRef.current);
  const mapGroup = d3.select(mapRef.current);
  const pointsGroup = d3.select(pointsRef.current);

  // Week to display on load, minimum and maximum week
  const start_week = 40;
  const min_week = 40;
  const max_week = 54;

  // Loading geodata
  const [geodata, setGeodata] = useState(null);
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    setGeodata(map_usa_counties);
    setLoc(weekly_county_data);
  }, []);

  // Cleaning data
  const [data, setData] = useState(null);

  ////////////////////////////////////////////////////////////
  // Slider STUFF
  ////////////////////////////////////////////////////////////

  // Control the slider value
  const [week, setWeek] = useState(start_week);
  const handleSliderChange = (event, newWeek) => {
    setWeek(newWeek);
  };

  // Control the play button
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = () => {
    setIsPlaying(true);
    if (week < max_week) {
      setWeek(week + 1);
    }
  };
  const handleStop = () => {
    setIsPlaying(false);
  };
  // setInterval() calls the function every X milliseconds
  var ms_between_updates = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        if (week < max_week) {
          setWeek(week + 1);
        } else {
          setIsPlaying(false);
        }
      }
    }, ms_between_updates);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, week]);

  ////////////////////////////////////////////////////////////
  // MAP STUFF
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!dimmensions || !svg || !geodata || !loc) return;
    const w = dimmensions.width;
    const h = dimmensions.height;
    svg.attr("viewBox", [0, 0, w, h]);

    // Define path generator
    var path = d3.geoPath();

    // Clean data for all weeks
    let county_features = new Map(
      topojson
        .feature(geodata, geodata.objects.counties)
        .features.map((d) => [d.id, d])
    );

    var clean_data = new Map();

    for (let week_idx = 1; week_idx <= 54; week_idx++) {
      var year_to_clean = 2020;
      var week_to_clean = week_idx;
      if (week_to_clean > 53) {
        year_to_clean = 2021;
        week_to_clean = 1;
      }

      const week_video_counts = loc.video_counts[year_to_clean][
        week_to_clean
      ].map((obj) => {
        let fips = obj.fips.toString().padStart(5, "0");
        return {
          id: fips,
          coord: path.centroid(county_features.get(fips)),
          name: obj.county,
          videos: obj.count,
        };
      });

      clean_data.set(week_idx, week_video_counts);
    }

    setData(clean_data);
    generate_map(mapGroup, pointsGroup, w, path, geodata);
  }, [dimmensions, geodata]);

  useEffect(() => {
    if (!dimmensions || !svg || !geodata || !loc || !data || !week) return;

    update_datapoints(pointsGroup, data.get(week));
  }, [dimmensions, pointsGroup, svg, data, week]);

  return (
    <div id="spikemap" className="my-10">
      <h2 className={classnames(classes.title)}>
        Parler Video Geolocation: Weekly Changes
      </h2>
      <p className={classnames(classes.paragraph)}>
        Below is a spike map showing the number of videos uploaded to Parler
        from each county in the USA between October and the January riots. Two 
        weeks really stand out: the week after the election (week 46 of 2020),
        where the <a href="https://www.washingtonpost.com/dc-md-va/2020/11/14/million-maga-march-dc-protests/" className={classnames(classes.link)}>
        "Million Maga March" took place</a>, and the week of the riots. In both cases,
        the number of videos uploaded from Washington, D.C. explode, showing a large 
        number of Parler users attending the rally.
      </p>
      <div className="w-full">
        <div
          className={classnames(classes.paragraph, "space-x-3 text-lg my-4")}
        >
          By clicking on
          <button
            onClick={handlePlay}
            className={"mx-4 focus:outline-none text-highlight-400"}
          >
            <BsFillPlayFill />
          </button>
          You can start the animation. You can stop the animation by clicking on
          <button
            onClick={handleStop}
            className={"mx-4 focus:outline-none text-highlight-400"}
          >
            <BsStopFill />
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <IOSSlider
            onChange={handleSliderChange}
            min={min_week}
            max={max_week}
            value={week}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
            color="secondary"
          />
        </div>
        <div
          className={classnames(
            className,
            "h-screen-4/5 max-w-7xl mx-auto my-10 px-10"
          )}
          ref={rootRef}
        >
          <svg className={classnames("")} ref={svgRef}>
            <g ref={mapRef}></g>
            <g ref={pointsRef}></g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CMap;
