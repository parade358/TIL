import React from 'react';

function AcsTabPanel({ ...props }) {
    const { children, value, index, ...other } = props;
    console.log(value, index);
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}

export default AcsTabPanel;
