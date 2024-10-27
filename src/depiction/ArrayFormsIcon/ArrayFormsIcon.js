import React from 'react';
import styled from 'styled-components';
import arraySvgs from '../../../assets/images/icon';

const Container = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 16px;
    height: 16px;
`;

const ArrayFormsIcon = ({ className }) => (
    <Container className={className}>{arraySvgs['array-forms-icon-dark']}</Container>
);

export default ArrayFormsIcon;
