import React from 'react';
import styled from 'styled-components';
import arraySvgs from '../../../assets/images/icon';

const Container = styled.div`
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    width: 110px;
    top:0;
    transition: 0.4s top, 0.4s opacity, 0.4s height;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    height:0px;
                `;
            case 'entered':
                return `
                    opacity:1;
                    height:149px;
                `;
            case 'exiting':
                return `
                    opacity:0;
                    height:0px;
                `;
            case 'exited':
                return `
                    opacity:0;
                    height:0px;
                `;
        }
    }};
`;

const Icon = styled.div`
    position: absolute;
    width: 109px;
    height: 116px;
    left: 0px;
    bottom: 0px;
`;

const ResourcesIcon = ({ className, animationState }) => (
    <Container className={className} animationState={animationState}>
        <Icon>{arraySvgs['array-resources-icon']}</Icon>
    </Container>
);

export default ResourcesIcon;
