import classnames from "classnames";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import useResizable from "../hooks/useResizable";
import Tweet from "./Tweet";
import { BsFillSkipStartFill } from "react-icons/bs";
import { classes } from "../classes";
import tweets from "./tweet.json";
const Plot = ({ className, data }) => {
  const svgRef = useRef();
  const rootRef = useRef();
  const dimmensions = useResizable(rootRef);
  const [tweet, setTweet] = useState(tweets[0]);
  const [replay, setReplay] = useState(0);

  const twitterSafetyTweet = {
    date: 1610148060000,
    picture:
      "https://pbs.twimg.com/profile_images/1356366102528315394/UHUFLIPh_400x400.jpg",
    handle: "@TwitterSafety",
    accountName: "Twitter Safety",
    id: 1346112444108836864,
    text: "After close review of recent Tweets from the @realDonaldTrump account and the context around them we have permanently suspended the account due to the risk of further incitement of violence.",
    isRetweet: 0,
    isDeleted: 0,
    favorites: 192000,
    retweets: 673000,
    isFlagged: 0,
  };
  // This method is ran we mounting the componenet. It is reran each time we click on the button to restart the visualization
  useEffect(() => {
    const render = async () => {
      // Select the reference to the parent SVG
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      if (!dimmensions || !data) return;
      // Get the dimmensions of the parent div to set the viewbox of the SVG. This allows us to have a responsive component
      const w = dimmensions.width;
      const h = dimmensions.height;
      svg.attr("viewBox", [0, 0, w, h]);

      const margin = { top: 16, right: 6, bottom: 6, left: 0 };
      // The number of bars to display
      const n = 12;
      // We have the bar size computed dynamically depending on the height, the margins and the number of bars displayed
      const barSize = (h - margin.top - margin.bottom) / n;
      // This is an interpolation factor used to smooth the transitions and not have the bars teleporting at each keyframe
      const k = 10;
      // The duration of each keyframe transition
      const duration = 400;
      // a map for all the
      const hashtag = new Set(data.map((d) => d.name));
      // We create an array for all the hashtags as we will need it to map each index to a different color in the color scale
      const hashtagArr = [...hashtag];
      // Set the color scale for bars. We use a categorical color scale.
      const myColor = d3
        .scaleOrdinal()
        // We set a color for each hashtag
        .domain([0, hashtagArr.length - 1])
        .range(d3.schemeSet2);

      const formatDate = d3.utcFormat("%Y-%m-%d");
      const datevalues = Array.from(
        d3.rollup(
          data,
          ([d]) => d.value,
          (d) => new Date(d.date).getTime(),
          (d) => d.name
        )
      )
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b));

      // We generate directly all the different transitions (keyframes)
      const keyframes = [];
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(
              (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t
            ),
          ]);
        }
      }
      keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);

      // Reorder the data based on the number of time the hashtag was used during that period
      function rank(value) {
        const data = Array.from(hashtag, (name) => ({
          name,
          value: value(name),
        }));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
        return data;
      }

      const hashframes = d3.groups(
        keyframes.flatMap(([, data]) => data),
        (d) => d.name
      );
      const prev = new Map(
        hashframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
      );
      const next = new Map(hashframes.flatMap(([, data]) => d3.pairs(data)));

      const y = d3
        .scaleBand()
        .domain(d3.range(n + 1))
        .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
        .padding(0.1);

      const x = d3.scaleLinear([0, 1], [margin.left, w - margin.right]);

      // Here we instantiate the methods that will be used to update our data for each keyframe
      const updateAxis = axis(svg);
      const updateBars = bars(svg);
      const updateLabels = labels(svg);
      const updateTicker = ticker(svg);

      const formatNumber = d3.format(",d");
      function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function (t) {
          this.textContent = formatNumber(i(t));
        };
      }
      // This counter is used to keep track of the keyframe index we are currently displaying
      var count = 0;
      for (const keyframe of keyframes) {
        count = count + 1;
        const transition = svg
          .transition()
          .duration(duration)
          .ease(d3.easeLinear);

        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].value]);
        // For each keyframe we update the axis
        updateAxis(keyframe, transition);
        // The bar sizing
        updateBars(keyframe, transition);
        // The bar labels
        updateLabels(keyframe, transition);
        // The ticker at the bottom displaying the date
        updateTicker(keyframe, transition);

        // We check the counter to change the tweet to display.
        if (
          Math.floor(count / (keyframes.length / tweets.length)) < tweets.length
        ) {
          setTweet(
            tweets[Math.floor(count / (keyframes.length / tweets.length))]
          );
        }
        if (count === keyframes.length) {
          // For the last tweet we wet the tweet from Twitter Safety
          setTweet(twitterSafetyTweet);
        }
        // invalidation.then(() => svg.interrupt());
        await transition.end();
      }

      // Method used to generate a function to update the axis of the animation for each keyframe
      function axis(svg) {
        const g = svg
          .append("g")
          .attr("transform", `translate(0,${margin.top})`);

        const axis = d3
          .axisTop(x)
          .ticks(w / 160)
          .tickSizeOuter(0)
          .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
          g.transition(transition).call(axis);
          g.select(".tick:first-of-type text").remove();
          g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
          g.select(".domain").remove();
        };
      }
      // This function generate a function used to upate the ticker displaying the current date in the animation for each keyframe
      function ticker(svg) {
        const now = svg
          .append("text")
          .style("font", `bold ${barSize}px var(--sans-serif)`)
          .style("font-size", "34px")
          .style("font-variant-numeric", "tabular-nums")
          .attr("text-anchor", "end")
          .style("fill", "white")
          .attr("x", w - 10)
          .attr("y", margin.top + barSize * (n - 0.45))
          .attr("dy", "0.32em")
          .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
          transition.end().then(() => now.text(formatDate(date)));
        };
      }

      // This function generate a method to update the labels on each bar for each keyframe
      function labels(svg) {
        let label = svg
          .append("g")
          .style("font", "bold 12px var(--sans-serif)")
          .style("font-variant-numeric", "tabular-nums")
          .attr("text-anchor", "end")
          .selectAll("text");

        return ([date, data], transition) =>
          (label = label
            .data(data.slice(0, n), (d) => d.name)
            .join(
              (enter) =>
                enter
                  .append("text")
                  .attr(
                    "transform",
                    (d) =>
                      `translate(${x((prev.get(d) || d).value)},${y(
                        (prev.get(d) || d).rank
                      )})`
                  )
                  .attr("y", y.bandwidth() / 2)
                  .attr("x", -6)
                  .attr("dy", "-0.25em")
                  .attr("font-weight", "bold")
                  .style("fill", "white")
                  .text((d) => d.name)
                  .call((text) =>
                    text
                      .append("tspan")
                      .attr("fill-opacity", 1)
                      .attr("font-weight", "bold")
                      .attr("x", -6)
                      .attr("dy", "1.15em")
                  ),
              (update) => update,
              (exit) =>
                exit
                  .transition(transition)
                  .remove()
                  .attr(
                    "transform",
                    (d) =>
                      `translate(${x((next.get(d) || d).value)},${y(
                        (next.get(d) || d).rank
                      )})`
                  )
                  .call((g) =>
                    g
                      .select("tspan")
                      .tween("text", (d) =>
                        textTween(d.value, (next.get(d) || d).value)
                      )
                  )
            )
            .call((bar) =>
              bar
                .transition(transition)
                .attr(
                  "transform",
                  (d) => `translate(${x(d.value)},${y(d.rank)})`
                )
                .call((g) =>
                  g
                    .select("tspan")
                    .tween("text", (d) =>
                      textTween((prev.get(d) || d).value, d.value)
                    )
                )
            ));
      }
      // This method generate a function that udpate the bars for each keyframe
      function bars(svg) {
        let bar = svg.append("g").attr("fill-opacity", 0.95).selectAll("rect");

        return ([date, data], transition) =>
          (bar = bar
            .data(data.slice(0, n), (d) => d.name)
            .join(
              (enter) =>
                enter
                  .append("rect")
                  .attr("height", y.bandwidth())
                  .attr("x", x(0))
                  .attr("y", (d) => y((prev.get(d) || d).rank))
                  .attr("fill", (d) => myColor(hashtagArr.indexOf(d.name)))
                  .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
              (update) => update,
              (exit) =>
                exit
                  .transition(transition)
                  .remove()
                  .attr("y", (d) => y((next.get(d) || d).rank))
                  .attr("width", (d) => x((next.get(d) || d).value) - x(0))
            )
            .call((bar) =>
              bar
                .transition(transition)
                .attr("y", (d) => y(d.rank))
                .attr("width", (d) => x(d.value) - x(0))
            ));
      }
    };
    render().catch((err) => console.log(err));
  }, [dimmensions, data, replay]);

  return (
    <div className="relative max-w-7xl mx-auto mb-8">
      <p className={classnames(classes.paragraph, "space-y-4")}>
        <p>

        The visualization beneath represents the evolution of the 12 top
        hashtags used by Parler's users during the year 2020 until January 2021
        and the shutdown of Parler after the Capitol riots in Washington DC. As
        we aim to show Parler as an echo chamber of the event happening during
        the year during the race for the elections we decided to embed some
        Tweets from Donald Trump during the same timeline.
        </p>
        <p>
          The visualization starts back in January 2020 during the Coronavirus
          outbreak.
        </p>
        <p>
          Trump supporters are present since the beginning of the platform and
          we can observe from the beginning the presence of{" "}
          <span className={classnames(classes.highlight)}>#trump2020</span>,{" "}
          <span className={classnames(classes.highlight)}>#maga </span>
          (Make America Great Again),{" "}
          <span className={classnames(classes.highlight)}>#kag2020</span> (Keep
          America Great),{" "}
          <span className={classnames(classes.highlight)}>#trump</span>.
        </p>
        <p>
          The hashtag{" "}
          <span className={classnames(classes.highlight)}>#twexit</span> is the
          result of a campaign to recruit disappointed Twitter uses who support
          Trump or oppose Twitter’s sanctioning.
        </p>
        <p>
          Throughout the whole timeline, we can notice the presence of many
          terms belonging to the <a href="https://www.bbc.com/news/53498434" className={classes.link}>American far-right conspiracy theory Qanon</a>  (
          <span className={classnames(classes.highlight)}>#qanon</span>). The
          hashtag{" "}
          <span className={classnames(classes.highlight)}>#WWG1WGA</span> for
          example standing for the movement motto: "Where We Go One, We Go All".
          This movement gathers believers in a conspiracy from what they see as
          elitist Democrats, politicians, journalists, and other institutional
          figures.{" "}
          <span className={classnames(classes.highlight)}>
            #thegreatawakening
          </span>{" "}
          is also one of the top hashtag used by Qanon believers.
        </p>
        <p>
          We can also clearly see the moment of the election with the rise of
          the hashtag{" "}
          <span className={classnames(classes.highlight)}>#stopthesteal</span>{" "}
          after Biden's win.
        </p>
      </p>
      <div
        className={classnames(
          classes.paragraph,
          "inline-block flex items-center space-x-3 text-lg my-4"
        )}
      >
        <div className={classnames("inline-block")}>By clicking on</div>
        <button
          className="block text-white focus:outline-none px-2 py-1 bg-red-500 rounded-lg"
          onClick={() => setReplay(replay + 1)}
        >
          {" "}
          <BsFillSkipStartFill size="1rem" />{" "}
        </button>
        <div className="inline-block">You can restart this chart.</div>
      </div>

      <Tweet className="absolute bottom-0 right-0 w-1/2 mb-14" tweet={tweet} />
      <div
        className={classnames(
          className,
          "h-screen-4/5 max-w-7xl mx-auto px-10"
        )}
        ref={rootRef}
      >
        <svg className={classnames("")} ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Plot;
