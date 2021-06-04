import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
import hashtags from "./top_hashtags_week.json";
import classnames from "classnames";
import Plot from "./Plot";
import useVisible from "../hooks/useIsVisible";
import {classes} from '../classes'

const Race = () => {
  const [data, setData] = useState(null);
  const raceRef = useRef();
  const isVisible = useVisible(raceRef);
  useEffect(() => {
    setData(hashtags);
  }, []);

  return (
    <div id="hashtags" ref={raceRef} className="px-10">
      <h2 className={classnames(classes.title)}>Parler Top Hashtags</h2>
      {isVisible && (
        <div className="w-full">
          <Plot data={data} />
        </div>
      )}
    </div>
  );
};

export default Race;
