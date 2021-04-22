# Milestone 1

## Dataset

Our work focuses on a dataset extracted from the now defunct social network Parler. It was a platform similar to Twitter, with users being able to create posts. Other users could interact with them through comments, upvotes and downvotes. It also used hashtags. Our dataset can be split into 3 main parts.

The first part contains 183 million posts and comments made to Parler between August 2018 and January 2021. For each one, we have information such as a timestamp, the number of upvotes and downvotes, and the hashtags it contains.

The second part provides information about Parler users, such as their biography, when their account was created, their number of followers, the number of people they follow and the number of posts and comments they made. These first two parts are taken from [Zenodo](https://zenodo.org/record/4442460#.YIGHfC0Rpqt), and are explained in greater detail in [this paper](https://arxiv.org/abs/2101.03820).

The last dataset we use contains metadata taken from videos posted to Parler. It was compiled and [posted to GitHub](https://gist.github.com/kylemcdonald/8fdabd6526924012c1f5afe538d7dc09) from the main Parler dataset. For each video included, it contains the time at which the video was created, the latitude and longitude where it was taken, and a unique ID. This unique ID can be used to obtain the video from an [archive of Parler](https://ddosecrets.com/wiki/Parler). Example: To download the video with ID `abcdef`, follow the URL `https://s3.wasabisys.com/ddosecrets-parler/abcdef`. Add the `mp4` extension to the downloaded file, and it can be watched.

The entire dataset is very clean, and requires little to no pre-processing.

## Problematic

Illustrate the echo chamber that was the Parler social network, and how it led to the attack on the American Capitol building on Januray the 6th, 2021.

## Exploratory Data Analysis

### Text

Exploration of the Parler dataset.

### Geodata

Exploration of the metadata included in videos uploaded to Parler.

## Related Work

Pro Publica sorted videos taken near the Capitol during the attacks, and [displayed them](https://projects.propublica.org/parler-capitol-videos/) in a neat timeline.

The [SMAT app](https://www.smat-app.com/) allows to search term frequency in different social networks, including Parler.
