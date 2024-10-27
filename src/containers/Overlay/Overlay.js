import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import produce from 'immer';

import { Transition } from 'react-transition-group';

const OverlayBackground = styled.div`
    z-index: 9991; /*position above wp left admin side panel */
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    transition: opacity 0.4s;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                `;
            case 'entered':
                return `
                    opacity:1;
                `;
            case 'exiting':
                return `
                    opacity:0;
                `;
            case 'exited':
                return `
                    display:none;
                    opacity:0;
                `;
        }
    }};
`;

const ContentContainer = styled.div`
    position: relative;
    width: 360px;
    height: 375px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
`;

const Overlay = ({ children, visible = false }) => {
    const [isVisible, setIsVisible] = useState(produce(visible, (draft) => {}));

    const onClick = (event) => {
        //prevent button posting the page
        event.preventDefault();
        event.stopPropagation();    
        setIsVisible(!isVisible);
    };

    return (
        <Transition in={isVisible} timeout={{ enter: 0, exit: 400 }}>
            {(animationState) => (
                <OverlayBackground onClick={onClick} animationState={animationState}>
                    <ContentContainer>{children}</ContentContainer>
                </OverlayBackground>
            )}
        </Transition>
    );
};

export default Overlay;
