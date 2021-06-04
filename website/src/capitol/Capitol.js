import gif_videos from "./capitol_riots.gif";
import riots_gif from './vertical_long.gif'
import classnames from "classnames";
import { classes } from "../classes";

const Capitol = () => {
  return (
    <div className="my-10">
      <h2 className={classnames(classes.title)}>Capitol Riots</h2>
      <p className={classnames(classes.paragraph, "drop-caps")}>
        Riots occured in and around the Capitol on January 6th, 2021. Below,
        we show a map of the locations from which videos were uploaded to Parler
        during that day. We can see the rally starting near the Washington Monument,
        and around 12:00 start moving towards the Capitol. Slowly, we see data points 
        emerge from inside the building. A 
        <a href="https://projects.propublica.org/parler-capitol-videos">timeline of the
        uploads</a> was created by ProPublica, where users can scroll and watch videos 
        as the riots evolve.
      </p>
      <div className="max-w-3xl my-4 mx-auto">
        <img src={gif_videos} alt="" className="block w-3/4 mx-auto"/>
      </div>
      <p className={classnames(classes.paragraph)}>
        Here we show a selection of frames taken from videos in the Parler dataset. We can see the users first in front of the Washington Monument and then in front the Capitol.
      </p>
      <div className="max-w-3xl mx-auto my-4 mx-auto">
        <img src={riots_gif} alt="" className="block w-3/4 mx-auto"/>
      </div>
    </div>
  );
};

export default Capitol;
