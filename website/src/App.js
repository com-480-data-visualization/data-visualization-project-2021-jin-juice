import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Timeline from "./Components/Timeline";
import Footer from "./Components/Footer";
import About from "./Components/About";
import CMap from "./circle_map/circle_map_slider";
import Map from "./map/Map";
import Race from "./race/Race";
import Text from "./text/Text";
import Navbar from "./Components/Navbar";
import Capitol from './capitol/Capitol'

function App() {
  return (
    <Router>
      <div className="min-h-full flex flex-col text-gray-100 bg-dark">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Timeline} />
          <Route exact path="/choropleth-map" component={Map} />
          <Route exact path="/evolution-map" component={CMap} />
          <Route exact path="/sentiments" component={Text} />
          <Route exact path="/race" component={Race} />
          <Route exact path="/capitol" component={Capitol} />
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
