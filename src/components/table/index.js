import React from 'react';
import _ from 'lodash';
import './table.css';

function Table(props) {
  if (!props.activities) 
    return <></>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>No</th>
          <th>Service Name</th>
          <th>Address</th>
          <th>Distance</th>
          <th>Driving Time</th>
          <th>End Date Time</th>
          <th>Preparation Time</th>
          <th>Waiting Time</th>
        </tr>
      </thead>
      <tbody>
        {(props.activities || []).map((activity, index) => {
          const address = props.addresses.filter((a) => a.type === activity.location_id);

          return (
            <tr key={`row_${index}`}>
              <td>{ activity.location_id.includes('home') ? 'H' : index}</td>
              <td>{activity.location_id}</td>
              <td>{_.get(address, '0.address', '')}</td>
              <td>{activity.distance / 1000} km</td>
              <td>{Math.ceil(activity.driving_time / 6000)} mins</td>
              <td>{activity.end_date_time}</td>
              <td>{activity.preparation_time}</td>
              <td>{activity.waiting_time}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
