const getKilometersByMeters = (meters: number) => {
  return (meters / 1000).toFixed(2);
};

export const measurements = {getKilometersByMeters};
