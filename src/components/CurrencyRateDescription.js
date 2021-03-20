import React from 'react';

const CurrencyRateDescription = ({currency, value}) => {
    return(
        <span>{value}<span>{currency}</span></span>
    );
}

export default CurrencyRateDescription;