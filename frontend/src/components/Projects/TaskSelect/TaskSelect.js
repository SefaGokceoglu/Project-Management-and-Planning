import React from "react";
import MultiSelect from "react-multi-select-component";

function TaskSelect({ Data, Dependencies, setDependencies }) {
  const Tasks = Data.map((value, index) => {
    return { label: value[0], value: value[0] };
  });

  return (
    <MultiSelect
      options={Tasks}
      value={Dependencies}
      onChange={setDependencies}
      labelledBy="Dependent To ... "
    />
  );
}

export default TaskSelect;
