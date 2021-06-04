# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Jean Chambras | 271630 |
| Iuliana Voinea | 308108 |
| Niels Poulsen | 270494 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

[Milestone 1 - Report](milestones/milestone1.md)

## Milestone 2 (7th May, 5pm)

**10% of the final grade**

[Milestone 2 - Report](milestones/milestone2.md)


## Milestone 3 (4th June, 5pm)

**80% of the final grade**

Our website is available [here](https://dataviz.jeanchambras.com/). Google Chrome or Firefox are recommended.

Our repository has the following structure:
* `eda` directory: contains exploratory data analysis we did in python
* `milestones` directory: contains our reports for [milestone 1](milestones/milestone1.md),
[milestone 2](milestones/milestone2.md) as well as our [process book](milestones/process_book.pdf)
* `data` contains images that were embed in the first two milestones
* `website` contains the code to run our website (all of it is contained in `src`).
    * `src/map` contains the code used to create the choropleth map
    * `src/text` contains the code used to create the sentiment analysis plots
    * `src/race` contains the code used to create the race plot
    * `src/circle_map` contains the code used to create the bubble map

To run the website, run from the `website` directory:

```
yarn install
yarn start
```

## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

