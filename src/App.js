import { useState, useEffect, useContext } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { Spin, Modal } from 'antd';
import 'antd/dist/antd.css';

import "./App.css";
import { ProgressContext } from './globalStorage/Progress';

import Marker from './components/Marker';
import Form from './components/Form';

export default function App() {
  const URL = "https://gist.githubusercontent.com/386er/84a78c9dd226a9395818/raw/dbed7a575d899876bff063a3590081f40816309e/airports.json";
  
  const [airports, setAirports] = useState({});
  const [selectedAirports, setSelectedAirports] = useState([]);

  const { progressValue, progressDispatch } = useContext(ProgressContext);


  const handleRoute = (route, distance) => {
    if (!route) {
      progressDispatch({ type: 'STOP' });
      return Modal.error({ content: 'No path' });
    }

    Modal.success({
      title: `Distance: ${Math.round(distance * 100) / 100}`,
      content: route.map(({ id, name }) => `${name} (${id})`).join(' -> '),
    });

    progressDispatch({ type: 'STOP' });

    setSelectedAirports(route);
  };

  useEffect(() => {
    const fetchAirports = async () => {
      const { data } = await axios.get(URL);

      const treatedData = {};

      data.forEach(
        ({
          Name: name,
          Longitude: longitude,
          Latitude: latitude,
          // destinations,
          "Airport ID": id
        }) => {
          if (!(isNaN(latitude) || isNaN(longitude))) {
            treatedData[id] = {
              name,
              longitude,
              latitude,
              destinations: [],
              distanceFromStarter: Infinity,
              previousAirport: null
            };
          }
        }
      );

      const allIds = Object.keys(treatedData);

      data.forEach(({
        'Airport ID': id,
        destinations,
        Longitude: longitude,
        Latitude: latitude,
      }) => {
        if (!(isNaN(latitude) || isNaN(longitude))) {
          treatedData[id].destinations = destinations
            .filter((destination) => allIds.includes(destination));
        }
      });

      setAirports(treatedData);
    };

    fetchAirports();
  }, []);

  return (
    <div className="App">
      {progressValue.shouldShow && (
        <Spin
          className="progress"
          // type="circle"
          size="large"
          percent={progressValue.value}
        />
      )}

      <Form handleRoute={handleRoute} airports={airports} setSelectedAirports={setSelectedAirports} />

      <GoogleMapReact
        className="map"
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        defaultCenter={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={0}
      >
        {Object.entries(airports).map(([airportId, airportInfo]) => {
          const { longitude, latitude } = airportInfo;

          return (
            <Marker
              lat={latitude}
              lng={longitude}
              text="My Marker"
              key={airportId}
              markedIndex={
                selectedAirports
                  .filter((each) => each)
                  .findIndex(({ id }) => id === airportId)
              }
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
};
