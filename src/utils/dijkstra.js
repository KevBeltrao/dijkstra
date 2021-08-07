const dijkstra = (base, startId, endId) => {
  if (startId === endId) {
    base[startId].distanceFromStarter = 0;
    return [startId];
  }
  let porcent = 0;
  
  const createTable = (
    airportId,
    distance = 0,
    visited = [],
    ) => {
      const currentAirport = base[airportId];

      if (currentAirport.distanceFromStarter <= distance) return;

      currentAirport.distanceFromStarter = distance;
      currentAirport.previousAirport = visited[visited.length - 1] || null;

      const filled = Object.values(base).filter(({ distanceFromStarter }) => (
        distanceFromStarter !== Infinity
      ));

      const newPorcent = filled.length * 100 / Object.keys(base).length;

      if (porcent !== newPorcent) {
        porcent = newPorcent;
        console.log(porcent);
      }

      currentAirport.destinations.forEach((destinationId) => {
        if (!visited.includes(destinationId) && base[destinationId]) {
          const { latitude: latitude1, longitude: longitude1 } = currentAirport;
          const { latitude: latitude2, longitude: longitude2 } = base[destinationId];
          
          const difference = (
            (latitude2 - latitude1) ** 2
            + (longitude2 - longitude1) ** 2
          ) ** 0.5;

          return createTable(destinationId, distance + difference, [...visited, airportId]);
        }
      });
    };

  createTable(startId);

  if (base[endId].distanceFromStarter === Infinity) {
    return null;
  }

  const find_shorter_path = (current = endId, acumulator = []) => {
    if (current === startId) {
      return [current, ...acumulator];
    }

    const airport = base[current];

    return find_shorter_path(airport.previousAirport, [current, ...acumulator]);
  };

  return find_shorter_path();
};

export default dijkstra;
