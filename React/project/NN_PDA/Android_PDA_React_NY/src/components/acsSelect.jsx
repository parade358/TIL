import { FormControl, InputLabel, makeStyles, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import colors from '../commons/colors.js';

const useStyle = makeStyles({
    wrapper: {
        backgroundColor: ({ backgroundColor }) => backgroundColor,
        marginRight: '5px',
    },
    root: {
        width: '100%',
    },
    label: {
        top: '-8px',
        left: '13px',
        width: '180px',
        color: '#000',
        fontWeight: 'bold',
    },
    select: {
        height: '40px',
    },
    option: {
        height: '20px',
        fontSize: '20px',
        padding: '8px 0 3px 10px',
        borderBottom: `1px solid ${colors.blackOpacity}`,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: colors.blackOpacity,
        },
    },
});

function AcsSelect({ height, backgroundColor, hasEmptyText, labelText, data, className, id, value, ...props }) {
    const classes = useStyle({ height, backgroundColor });

    return (
        <div className={`${classes.wrapper} ${className}`}>
            <FormControl color="primary" className={classes.root}>
                <InputLabel className={classes.label} htmlFor={id} shrink={true}>
                    {labelText}
                </InputLabel>
                <Select //
                    className={classes.select}
                    labelId={id}
                    id={id}
                    value={value}
                    style={{ height: '40px' }}
                    variant="filled"
                    {...props}
                >
                    {hasEmptyText === true && <option aria-label="None" className={classes.option} />}

                    {data.map((item) => (
                        <option className={classes.option} value={item.value} key={item.value}>
                            {item.label}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default AcsSelect;

AcsSelect.defaultProps = {
    labelText: 'label',
    variant: 'outlined',
    backgroundColor: 'inheritance',
    height: '40px',
    data: [],
    hasEmptyText: false,
};

AcsSelect.propTypes = {
    id: PropTypes.string.isRequired,
};
