import React from "react";

const DataButton = ({type, clicked, onClick}) => (
    <div className="">
        <button  
            className={clicked === type ? "text-highlight-400 focus:outline-none font-bold border-b-2 border-highlight-400" : "text-white font-bold focus:outline-none"}
            onClick={() => onClick(type)}>
                {type}
        </button>
  </div>
);

export default DataButton;
