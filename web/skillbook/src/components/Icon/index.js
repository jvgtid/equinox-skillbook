import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ size, icon, color, viewPort, strong, vw }) => {
    const unit = vw ? 'vw' : 'px';

    const styles = {
        svg: {
            display: 'inline-block',
            margin: 'auto',
            verticalAlign: 'middle',
        },
        path: { fill: color },
    };

    if (strong) {
        styles.path.stroke = color;
        styles.path.strokeWidth = 2;
    }

    return (
        <svg
            style={ styles.svg }
            width={ `${size}${unit}` }
            height={ `${size}${unit}` }
            viewBox={ `0 0 ${viewPort} ${viewPort}` }
        >
            <path
                style={ styles.path }
                d={ icon }
            />
        </svg>
    );
};

Icon.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number,
    viewPort: PropTypes.number,
    strong: PropTypes.bool,
    vw: PropTypes.bool.isRequired
};

Icon.defaultProps = {
    size: 20,
    viewPort: 24,
    strong: false,
    vw: false
};

export default Icon;
