import { useRef, useContext } from 'react';
import  { ProgressContext } from '../../globalStorage/Progress';

import './styles.css';
import dijkstra from '../../utils/dijkstra';

const Select = ({ list, reference }) => {
  return (
    <select ref={reference}>
      {list.map(([id, { name }]) => (
        <option key={id} value={id}>{name}</option>
      ))}
    </select>
  );
};

const Form = ({ airports, handleRoute, setSelectedAirports }) => {
  const selectStartRef = useRef();
  const selectEndRef = useRef();

  const { progressDispatch } = useContext(ProgressContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    setSelectedAirports([]);

    progressDispatch({ type: 'START' });

    const result = dijkstra(
      airports,
      selectStartRef.current.value,
      selectEndRef.current.value,
      (newValue) => progressDispatch({ type: 'UPDATE', value: newValue }),
    );

    handleRoute(
      result.map((airportId) => ({ id: airportId, name: airports[airportId].name })),
      airports[selectEndRef.current.value].distanceFromStarter,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <Select reference={selectStartRef} list={Object.entries(airports)} />
      <Select reference={selectEndRef} list={Object.entries(airports)} />

      <button type="submit">Encontrar rota</button>
    </form>
  );
}
 
export default Form;
