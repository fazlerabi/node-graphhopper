import React, { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { ExcelRenderer } from 'react-excel-renderer';
import Table from './components/table';
import MapContainer from './components/map_container';
import './App.css';

function App() {
  const [addresses, setAddresses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drawnPolylines, setDrawnPolylines] = useState([]);
  const address = [];
  const fileHandler = (event) => {
    let fileObj = event.target.files[0];

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setAddresses([]);
        setMarkers([]);
        setRoutes([]);
        if (!!drawnPolylines.length) {
          drawnPolylines.map(line => {
            line.setMap(null);
          });
        }

        resp.rows.map((row, index) => {
          if (index >= 1) {
            let add = '';
            resp.rows[0].map((col, ind) => {
              if (col.includes('Title') || col.includes('Address')) {
                add += row[ind];
              }
            });
            address.push({
              type: index === 1 ? 'home' : `stop${index - 1}`,
              address: add,
            });
          }
        });
        setAddresses(address);
      }
    });
  };

  const process = async () => {
    const { data } = await axios.post('/api/v1', {
      address: addresses,
    });
    setMarkers(data.markers);
    setRoutes(_.get(data, 'solution.routes.0', {}));
  };

  return (
    <div className="App">
      <input type="file" onChange={fileHandler} style={{ padding: '10px' }} />
      <button onClick={process}>Process</button>
      <MapContainer markers={markers} routes={routes} setDrawnPolylines={setDrawnPolylines} />
      <Table activities={routes.activities} addresses={addresses} />
    </div>
  );
}

export default App;
