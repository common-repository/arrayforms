import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
    /** Material icon unicode */
    icon: PropTypes.oneOfType([PropTypes.number]),
    /** CSS Color */
    color: PropTypes.string,
    /** CSS Font size */
    size: PropTypes.string,
    /** CSS class */
    className: PropTypes.string,
    /** function called when clicked */
    onClick: PropTypes.func,
    /** title attribute */
    title: PropTypes.string
};

const Container = styled.span`
    color: ${({ iconColor }) => iconColor};
    font-size: ${({ size }) => size};
    &:before {
        font-family: Material-Design-Iconic-Font;
        //StyledComponents performance reason:
        //content: assigned this way so StyledComponents doesn't create hundreds of separate classnames for each icon
        content: attr(data-icon-unicode);
    }
`;

/**
 * Creates a Material Design icon.
 *
 * https://zavoloklom.github.io/material-design-iconic-font/cheatsheet.html
 */
const Icon = ({
    icon = false,
    color = '#000000',
    size = '16px',
    className = '',
    onClick = () => {},
    title
}) => {
    return (
        <Container
            iconColor={color}
            size={size}
            data-icon-unicode={String.fromCharCode(icon)}
            className={className}
            onClick={onClick}
            title={title}
        />
    );
};

Icon.propTypes = propTypes;

export default Icon;
