import React from "react";
import classnames from 'classnames'

const Legend = ({data, selectedItems, onChange}) => (
  <div className="legendContainer space-y-1 mt-2">
    {data.map((d) => (
      <div className="checkbox" style={{ color: d.color }} key={d.name}>
        {/*{d.name !== "positive" && (*/}
          <input
            type="checkbox"
            value={d.name}
            checked={selectedItems.includes(d.name)}
            onChange={() => onChange(d.name)}
            className={classnames("form-checkbox rounded mr-2 focus:outline-none", d.checkboxColor)}
          />
        <label className="uppercase text-sm tracking-widest ">{d.name}</label>
      </div>
    ))}
  </div>
);

export default Legend;
