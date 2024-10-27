import React from 'react';
import styled from 'styled-components';
import arraySvgs from '../../../assets/images/icon';

const Container = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 180px;
    height: 50px;
`;

const ArrayIcon = styled.div`
    position: absolute;
    width: 180px;
    top: 0px;
    transition: 0.4s top, 0.4s opacity;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    top:60px;
                `;
            case 'entered':
                return `
                    opacity:1;
                    top:0px;
                `;
            case 'exiting':
                return `
                    opacity:0;
                    top:60px;
                `;
            case 'exited':
                return `
                    opacity:0;
                    top:60px;
                `;
        }
    }};
`;

const ArrayText = styled.div`
    position: absolute;
    width: 60px;
    top: 5px;
    left: 38px;
    transition: 0.4s top, 0.4s opacity;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    top:60px;
                `;
            case 'entered':
                return `
                    opacity:1;
                    top:5px;
                `;
            case 'exiting':
                return `
                    opacity:0;
                    top:60px;
                `;
            case 'exited':
                return `
                    opacity:0;
                    top:60px;
                `;
        }
    }};
`;

const ArrayLogo = ({ className, animationState }) => (
    <Container className={className}>
        <ArrayIcon animationState={animationState}>{arraySvgs['array-icon']()}</ArrayIcon>
    </Container>
);

export default ArrayLogo;
