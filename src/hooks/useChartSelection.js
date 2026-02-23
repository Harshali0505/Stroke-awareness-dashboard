import { useState } from "react";

const useChartSelection = () => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected((prev) => (prev === value ? null : value));
  };

  return {
    selected,
    onSelect: handleSelect
  };
};

export default useChartSelection;

