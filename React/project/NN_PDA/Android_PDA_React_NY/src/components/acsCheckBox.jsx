import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

function AcsCheckBox({ label, ...props }) {
    return (
        <FormControlLabel
            {...props}
            control={<Checkbox/>}
            label={label}
        />
    );
}

export default AcsCheckBox;