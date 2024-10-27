import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.input.attrs((props) => ({
    type: props.inputType
}))`
    cursor: pointer;
    box-sizing: border-box;
    width: 100%;
    padding: 8px 16px;
    ${({ inputType }) =>
        inputType === 'number' &&
        `
        text-align:center;
        padding-right:0;
        padding-left:12px;
    `}
    font-family: 'Poppins';
    font-size: 13px;
    font-weight: 500;
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    outline: none;
    color: #4a4a4a;
    ${({ invalid }) =>
        invalid
            ? `
                outline:2px solid #f6860e;
            `
            : ``}
`;

const Text = React.forwardRef(
    (
        {
            id = undefined,
            value = '',
            placeholder = '',
            onChange = () => {},
            onBlur = () => {},
            onFocus = () => {},
            onKeyPress = () => {},
            onKeyDown = () => {},
            className = '',
            inputType = 'text',
            invalid = undefined,
            maxLength = undefined
        },
        ref
    ) => (
        <Input
            ref={ref}
            className={className}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            id={id}
            inputType={inputType}
            invalid={invalid}
            maxLength={maxLength}
        />
    )
);

Text.propTypes = {
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    invalid: PropTypes.bool,
    maxLength: PropTypes.number
};

export default Text;
