import React, { useEffect, useState } from "react";
import classnames from "classnames";
import SentimentTimeSeries from "./SentimentTimeSeries";
import Legend from "./Legend";
import DataButton from "./DataButton";
import pos_sentiment from "./sentiment_positive.json";
import neg_sentiment from "./sentiment_negative.json";
import biden_pos_sentiment from "../text/biden_sentiment_positive.json";
import biden_neg_sentiment from "../text/biden_sentiment_negative.json";
import trump_pos_sentiment from "../text/trump_sentiment_positive.json";
import trump_neg_sentiment from "../text/trump_sentiment_negative.json";
import "./styles.css";
import { classes } from "../classes";

const posSentData = {
  name: "positive",
  color: "#28B463",
  checkboxColor: "text-green-chart",
  type: "Overal posts",
  items: pos_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const negSentData = {
  name: "negative",
  color: "#cf364a",
  checkboxColor: "text-highlight-400",
  type: "Overal posts",
  items: neg_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const bidenPosSentData = {
  name: "positive",
  color: "#28B463",
  type: "Biden biden_pos_sentiment",
  items: biden_pos_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const bidenNegSentData = {
  name: "negative",
  color: "#cf364a",
  type: "Biden posts",
  items: biden_neg_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const trumpPosSentData = {
  name: "positive",
  color: "#28B463",
  type: "Trump posts",
  items: trump_pos_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const trumpNegSentData = {
  name: "negative",
  color: "#cf364a",
  type: "Trump posts",
  items: trump_neg_sentiment.map((d) => ({
    value: parseInt(d.value),
    date: new Date(d.date),
  })),
};

const margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
};

const Text = () => {
  const [selectedItems, setSelectedItems] = React.useState([
    "positive",
    "negative",
  ]);
  const [legendData, setLegendData] = React.useState([
    posSentData,
    negSentData,
  ]); //, neuSentData]);
  const [posData, setPosData] = React.useState(posSentData);
  const [negData, setNegData] = React.useState(negSentData);
  const [clicked, setClicked] = React.useState("Overall posts");
  const chartData = [
    ...[posData, negData].filter((d) => selectedItems.includes(d.name)),
  ];

  const onChangeSelection = (name) => {
    let newSelectedItems;

    if (selectedItems.includes(name)) {
      newSelectedItems = selectedItems.filter((item) => item !== name);
    } else {
      newSelectedItems = [...selectedItems, name];
    }

    if (newSelectedItems.length == 0) {
      alert("At least one sentiment must be selected!");
    } else {
      setSelectedItems(newSelectedItems);
    }
  };

  const onClick = (type) => {
    if (type === "Biden posts") {
      setPosData(bidenPosSentData);
      setNegData(bidenNegSentData);
      setClicked("Biden posts");
    } else if (type === "Overall posts") {
      setPosData(posSentData);
      setNegData(negSentData);
      setClicked("Overall posts");
    } else if (type === "Trump posts") {
      setPosData(trumpPosSentData);
      setNegData(trumpNegSentData);
      setClicked("Trump posts");
    }
  };

  return (
    <div id="textanalysis" className="my-8">
      <h2 className={classnames(classes.title)}>Parler Sentiment Analysis</h2>
      <p className={classnames(classes.paragraph, "drop-caps space-y-4")}>
        <p >
          The visualization below illustrates how the sentiments of Parler posts and comments
          evolve through time. Each peak can be associated with certain political events through
          further investigation i.e. tweets/statements by influential political figures, the
          Capitol Raid etc. We chose to only show polar sentiments (positive and negative)
          and discard neutral ones.
        </p>  
        <p >
          The 'Overall posts' view presents a global sentiment analysis of the entire collection
          of Parler posts and comments. However, we perfomed local sentiment analysis as
          well in order to gain additional inshights. Thus, we chose two popular terms, 'Biden'
          and 'Trump', and analysed the sentiments of the sentences containing these terms in the
          dataset, resulting in two additional views: 'Biden posts' and 'Trump posts'.
        </p>
        <p className={classnames(classes.citation)}>
          After exploring the visualization, one can conclude that the global tone of Parler is
          positive, particularly around key events such as: June 20th 2020 when president Trump held
          his first 2020 campaign rally in months taking place in Oklahoa, and the USA election
          held on November 3rd 2020 when the number of posts exploded. The support towards Trump
          voiced on the platform is also reflected by a sentiment trend of mainly positive sentiment
          sentences containing the term 'Trump' which is similar to the global sentiment trend. The
          only moment marked by a dominating number of negative posts was the January 8th 2021, the date
          corresponding to Trump's ban from Twitter and people discussing the failed Capitol assault 
          which took place on January 6th 2021 and its repercussions. This finding was expected since
          the user body is predominantly comprised of Trump supporters.
        </p>
        <p className={classnames(classes.citation)}>
          Furthermore, the aversion of the users towards Joe Biden comes through as the sentiment
          of the sentences containing the term 'Biden' is mostly negative, even the apparent positive
          sentiment sentences being in reality jokes and sarcastic comments.
        </p>
      </p>


      <div className="max-w-7xl ml-auto mt-4">
        <Legend
          data={legendData}
          selectedItems={selectedItems}
          onChange={onChangeSelection}
        />
      </div>
      <div className="flex space-x-4 max-w-7xl mt-2 ml-auto">
        <DataButton
          type={"Overall posts"}
          clicked={clicked}
          onClick={onClick}
        />
        <DataButton type={"Biden posts"} clicked={clicked} onClick={onClick} />
        <DataButton type={"Trump posts"} clicked={clicked} onClick={onClick} />
      </div>
      

      <div className="mx-auto max-w-7xl">
        <SentimentTimeSeries data={chartData} margin={margin} />
      </div>
    </div>
  );
};

export default Text;
