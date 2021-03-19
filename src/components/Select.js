import React from "react";

const Select = ({options, action, referrense}) => {
    return(
        <select name="" id=""
                ref={referrense}
                onChange={(e) => action(e.target)}
        >
            {options?.map((item, index) => {
                return <option key={index + item[0]} value={item[0]}>{item[0]}</option>
            })}
        </select>
    );
}

export default  Select;