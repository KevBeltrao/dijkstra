import { useState, useContext } from 'react';
import { Select as SelectAntd, Button } from 'antd';

import  { ProgressContext } from '../../globalStorage/Progress';

import './styles.css';
import dijkstra from '../../utils/dijkstra';

const Select = ({ list, value, setValue }) => {
  return (
    <SelectAntd
      value={value}
      onChange={setValue}
      showSearch
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {list.map(([id, { name }]) => (
        <SelectAntd.Option key={id} value={id}>{name}</SelectAntd.Option>
      ))}
    </SelectAntd>
  );
};



const Form = ({ airports, handleRoute, setSelectedAirports }) => {
  const [starterSelect, setStarterSelect] = useState(null);
  const [endSelect, setEndSelect] = useState(null);

  const { progressDispatch } = useContext(ProgressContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    setSelectedAirports([]);

    progressDispatch({ type: 'START' });

    setTimeout(() => {
      const result = dijkstra(
        airports,
        starterSelect,
        endSelect,
      );
  
      handleRoute(
        result?.map((airportId) => ({ id: airportId, name: airports[airportId].name })),
        airports[endSelect].distanceFromStarter,
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <Select
        value={starterSelect}
        setValue={setStarterSelect}
        list={Object.entries(airports)}
      />

     <Select
      value={endSelect}
      setValue={setEndSelect}
      list={Object.entries(airports)}
      />

      <Button
        htmlType="submit"
        type="primary"
        disabled={!starterSelect || !endSelect}
      >Encontrar rota</Button>
    </form>
  );
}
 
export default Form;
