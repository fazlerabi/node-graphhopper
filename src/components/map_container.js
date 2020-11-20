import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import _ from 'lodash';
import Marker from './marker';
import './marker.css';

function deepCompareEquals(a, b){
  return _.isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useDeepCompareEffect(callback, dependencies) {
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  )
}

function MapContainer(props) {
  const { routes, markers, setDrawnPolylines } = props;
  const [mapsReference, setMapsReference] = useState(null);
  const [mapReference, setMapReference] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7065811, lng: -73.9236395 });

  useDeepCompareEffect(() => {
    if (_.get(markers, '0.coordinate', null)) {
      setCenter(_.get(markers, '0.coordinate', null));
    }
  }, [markers]);

  const handleApiLoaded = (map, maps) => {
    setMapReference(map);
    setMapsReference(maps);
  };

  useEffect(() => {
    const drawnPolylines = [];
    (routes.points || []).forEach((locations, index) => {
      let path = [];
      locations.coordinates.forEach(function (location) {

        const pathLatLong = {
          lat: location[1],
          lng: location[0],
        };
        path.push(pathLatLong);
      });
      if (_.get(routes, `activities.${index + 1}.address.lat`, null) !== null) {
        path.push({
          lat: _.get(routes, `activities.${index + 1}.address.lat`, 0),
          lng: _.get(routes, `activities.${index + 1}.address.lon`, 0)
        });
      }

      if (mapsReference && mapReference) {
        const drawnPolyline = new mapsReference.Polyline({
          strokeColor: '#7fe0ee',
          strokeOpacity: 1,
          strokeWeight: 4,
          path: path,
        });
        drawnPolylines.push(drawnPolyline);
        drawnPolyline.setMap(mapReference);

        mapsReference.event.addListener(drawnPolyline, 'mouseover', () => {

          drawnPolyline.setOptions({
            zIndex: 1000000000,
            strokeWeight: 6,
            strokeColor: '#00ff00',
          });
        });

        mapsReference.event.addListener(drawnPolyline, 'mouseout', () => {

          drawnPolyline.setOptions({
            zIndex: 1,
            strokeWeight: 4,
            strokeColor: '#7fe0ee',
          });
        });
      }
    });
    setDrawnPolylines(drawnPolylines);
  }, [mapsReference, routes, mapReference]);

  return (
    <div className="map__container">
      <GoogleMapReact
        defaultZoom={10}
        defaultCenter={center}
        center={center}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        bootstrapURLKeys={{ key: 'AIzaSyCB5ELK-MyT_h_XUxkLz8gVlEIlloseKyo' }}
      >
        {(routes.activities || []).map((marker, index) => {
          return (
            <Marker
              key={`marker_${index}`}
              title={marker.location_id}
              name={index}
              lat={marker.address.lat}
              lng={marker.address.lon}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default MapContainer;
