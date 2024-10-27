import React from 'react';
import styled from 'styled-components';

const StyledLoadingSpinner = styled.div`
    & {
        display: flex;
        position: relative;
        width: ${(props) => (props.size ? props.size * 1.2 : 28)}px;
        height: ${(props) => (props.size ? props.size * 1.2 : 28)}px;
    }
    & div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: ${(props) => (props.size ? props.size : 24)}px;
        height: ${(props) => (props.size ? props.size : 24)}px;
        margin: ${(props) => (props.size ? props.size / 8 : 3)}px;
        border: ${(props) => (props.size ? props.size / 8 : 3)}px solid
            ${(props) => (props.color ? props.color : '#0084ff')};
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${(props) => (props.color ? props.color : '#0084ff')} transparent transparent
            transparent;
    }
    & div:nth-child(1) {
        animation-delay: -0.45s;
    }
    & div:nth-child(2) {
        animation-delay: -0.3s;
    }
    & div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const Container = styled.div`
    display: flex;
    position: relative;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    margin: 5px 0px;
`;

const Label = styled.div`
    margin-right: 5px;
`;

const LoadingSpinner = ({ color, size, children, className }) => (
    <Container className={className}>
        {children ? <Label>{children}</Label> : null}
        <StyledLoadingSpinner color={color} size={size}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </StyledLoadingSpinner>
    </Container>
);

export default LoadingSpinner;
