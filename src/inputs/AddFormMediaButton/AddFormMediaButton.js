import styled from 'styled-components';

import arraySvgs from '../../../assets/images/icon';

const Container = styled.button`
    display: inline-flex;
    align-items: center;
    &.button {
        display: inline-flex;
        align-items: center;
    }
`;

const ArrayIcon = styled.span`
    display: inline-flex;
    width: 18px;
    height: 18px;
    margin-right: 3px;
`;

const ButtonText = styled.span``;

/**
 * Click event bubbles up through into the overlay of classEditorFormSelect.js
 */
const AddFormMediaButton = () => {
    return (
        <Container className={'button'}>
            <ArrayIcon>{arraySvgs['array-icon-classic-editor']}</ArrayIcon>
            <ButtonText>Add Form</ButtonText>
        </Container>
    );
};

export default AddFormMediaButton;
