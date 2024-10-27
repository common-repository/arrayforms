import React, { useState, useRef, useMemo, useEffect, createRef } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import produce from 'immer';

import Icon from '../../depiction/Icon/Icon';
import Text from '../Text/Text';
import ClickOutside from '../../containers/ClickOutside/ClickOutside';
import LoadingSpinner from '../../status/LoadingSpinner/LoadingSpinner';
import ArrayFormsIcon from '../../depiction/ArrayFormsIcon/ArrayFormsIcon';

const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    font-family: 'Poppins';
    font-size: 14px;
`;

const SearchInputWrapper = styled.div`
    z-index: 2;
    display: flex;
    position: relative;
    align-items: center;
    width: 100%;
`;

const SearchIcon = styled(Icon)`
    position: absolute;
    right: 10px;
    top: 9px;
    line-height: 21px;
`;

const SearchInput = styled(Text)`
    height: 30px;
    min-height: 30px !important;
    margin: 0 !important;
    padding: 9px 15px 9px 10px !important;
    font-family: 'Poppins';
    font-weight: 500;
    font-size: 12px;
    line-height: 14px !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
    &::placeholder {
        color: ${({ placeholderColor }) => placeholderColor};
    }
`;

const DropDownIcon = styled(Icon)`
    position: absolute;
    right: 10px;
    top: 5px;
    line-height: 21px;
    /* transition: transform 0.4s;
    ${({ dropDownOpen }) =>
        dropDownOpen &&
        `
        transform: rotateX(180deg);
    `} */
`;

const SelectedValues = styled.div`
    padding: 9px 30px 9px 10px;
    overflow: hidden;
    font-family: 'Poppins';
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.4s;
`;

const SelectedValuesContainer = styled.div`
    cursor: pointer;
    position: relative;
    display: flex;
    height: 30px;
    background-color: #fff;
    border-radius: 4px;
    align-items: center;
    &:hover {
        ${SelectedValues} {
            color: var(--accent);
        }
    }
`;

const SearchValuesOverlay = styled.div`
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const PlaceHolderValues = styled.div`
    display: flex;
    align-items: center;
    height: 32px;
    padding: 10px 15px 10px 10px;
    font-weight: 500;
    font-family: 'Poppins';
    font-size: 12px;
    line-height: 12px;
    color: ${({ color }) => color};
`;

const LoadingTextContainer = styled.div`
    padding-left: 10px;
    font-size: 12px;
    line-height: 12px;
`;

const DropDownContainer = styled.div`
    position: absolute;
    width: calc(100% + 16px);
    margin: 8px -8px 0 -8px;
    box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.11);
    border-radius: 0 0 6px 6px;
`;

const OptionsContainer = styled.div`
    max-height: 0px;
    padding: 7px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 0 0 6px 6px;
    transition: 0.4s max-height, 0.4s opacity, 0.4s padding;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    padding: 0px 7px;
                    max-height:0px;
                    overflow: hidden;
                `;
            case 'entered':
                return `
                    opacity:1;
                    padding: 7px;
                    max-height:230px;
                    overflow-y: scroll;
                `;
            case 'exiting':
                return `
                    opacity:0;
                    padding: 0px 7px;
                    max-height:0px;
                    overflow: hidden;
                `;
            case 'exited':
                return `
                    opacity:0;
                    padding: 0px 7px;
                    max-height:0px;
                    overflow: hidden;
                `;
        }
    }};
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background: #eee;
        border-radius: 6px;
        border-left: 1px solid #fff;
        border-right: 1px solid #fff;
        &:hover {
            background: #dbdbdb;
        }
    }
`;

const OptionContainer = styled.div`
    cursor: pointer;
    font-family: 'Poppins';
    border-radius: 5px;
    border-top: 1px solid #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    color: #323232;
    transition: 0.2s opacity, 0.2s max-height, 0.2s padding, 0.2s border-width, 0.3s color,
        0.3s background-color;
    ${({ visible }) =>
        visible
            ? `
            opacity:1;
            max-height:100px;
            padding: 9px 15px 9px 11px;
            border-width:1px;
        `
            : `
            opacity:0;
            max-height:0px;
            padding: 0px 15px 0px 11px;
            border-width:0px;
            overflow:hidden;
        `}
    ${({ selected }) =>
        selected
            ? `
            background-color:#f4f5fa;
        `
            : `
            &:hover {
                background-color: #f9f9f9;
                color: var(--accent, #007fde);
            }
        `}
    ${({ keyboardFocused }) =>
        keyboardFocused &&
        `
            background-color: #f9f9f9;
            color: var(--accent, #007fde);
        `}
    ${({ empty }) =>
        empty
            ? `
            font-weight:500;
            font-style:italic;
            background-color: transparent;
            color:#000;
            &:hover {
                background-color: transparent;
                color:#000;
            }
        `
            : `
            
        `}
`;

const FormsIcon = styled(ArrayFormsIcon)`
    margin-left: 10px;
    min-width: 16px;
`;

/**
 * Select box for when react-select isn't enough
 */
const CustomSelect = ({
    options = [],
    className,
    maxNumOfSelections = 1,
    placeholder = 'Select...',
    placeholderColor = '#b6b6b6',
    onChange = null,
    value = null,
    loading = false,
    loadingText = 'Loading ...',
    dropDownIcon = 0xf2f2,
    dropDownIconSize = '24px',
    sortLabelsBy = (a, b) => {
        const aToLower = String(a.label).toLowerCase();
        const bToLower = String(b.label).toLowerCase();
        if (aToLower < bToLower) return -1;
        if (aToLower > bToLower) return 1;
        return 0;
    },
    onExpanded = () => {}
}) => {
    const searchInputRef = useRef(null);
    const optionsContainerRef = useRef(null);

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [currentKeyboardSelection, setCurrentKeyboardSelection] = useState(null);

    const canOnlySelectOneValue = maxNumOfSelections === 1;
    const optionHasBeenSelected = value !== null;
    const optionRefs = useMemo(
        () =>
            Array(options.length)
                .fill()
                .map(() => createRef()),
        [options]
    );

    const onClickOutside = () => {
        setDropDownOpen(false);
    };

    const onSelectBoxClicked = () => {
        setDropDownOpen(!dropDownOpen);
    };

    const onSearchInputChange = (event) => {
        const { value } = event.target;
        setSearchInputValue(value);
    };

    const onExpandDropDown = () => {
        setSearchInputValue('');
        searchInputRef.current.focus();
    };

    const onSelect = (newSelections) => {
        if (typeof onChange === 'function') {
            onChange(canOnlySelectOneValue ? newSelections[0] : newSelections);
        }
    };

    const selectedOptions = useMemo(() => {
        return value !== null ? (value instanceof Array ? value : [value]) : null;
    }, [value]);

    const onOptionClicked = (clickedOption) => {
        if (canOnlySelectOneValue) {
            onSelect([clickedOption]);
            setDropDownOpen(false);
        } else {
            const alreadySelectedIndex = selectedOptions.findIndex(
                (option) => option.value === clickedOption.value
            );
            if (alreadySelectedIndex === -1) {
                if (selectedOptions.length < maxNumOfSelections) {
                    const newSelections = produce(selectedOptions, (draft) => {
                        draft.push(clickedOption);
                    });
                    onSelect(newSelections);
                }
            } else {
                const newSelections = produce(selectedOptions, (draft) => {
                    draft.splice(alreadySelectedIndex, 1);
                });
                onSelect(newSelections);
            }
        }
    };

    const onKeyboardEnter = () => {
        if (canOnlySelectOneValue) {
            if (currentKeyboardSelection !== null) {
                const selectedOption = options.filter(
                    (option) =>
                        option.value === currentKeyboardSelection &&
                        (!searchInputValue ||
                            option.label.toLowerCase().includes(searchInputValue.toLowerCase()))
                );
                if (selectedOption.length) {
                    onSelect(selectedOption);
                    setDropDownOpen(false);
                } else {
                    selectFirstOptionInList();
                }
            } else {
                //enter key pressed without any selection
                selectFirstOptionInList();
            }
            setCurrentKeyboardSelection(null);
        }
    };

    const selectFirstOptionInList = () => {
        const filteredOptions = options
            .sort(sortLabelsBy)
            .filter(
                (option) =>
                    !searchInputValue ||
                    option.label.toLowerCase().includes(searchInputValue.toLowerCase())
            );
        if (filteredOptions.length) {
            onSelect([filteredOptions[0]]);
            setDropDownOpen(false);
        }
    };

    const changeKeyboardSelection = (move) => {
        let newKeyboardValue = null;
        let newKeyboardIndex = 0;
        const filteredOptions = options
            .sort(sortLabelsBy)
            .filter(
                (option) =>
                    !searchInputValue ||
                    option.value === currentKeyboardSelection ||
                    option.label.toLowerCase().includes(searchInputValue.toLowerCase())
            );
        const currentKeyboardIndex = filteredOptions.findIndex(
            (option) => option.value === currentKeyboardSelection
        );
        if (move > 0) {
            //if keyboard option hasn't been chosen yet (default starting position)
            if (currentKeyboardIndex === -1) {
                if (filteredOptions.length) {
                    newKeyboardIndex = 0;
                    newKeyboardValue = filteredOptions[newKeyboardIndex].value;
                }
            } else {
                if (filteredOptions.length > currentKeyboardIndex + 1) {
                    newKeyboardIndex = currentKeyboardIndex + 1;
                    newKeyboardValue = filteredOptions[newKeyboardIndex].value;
                }
            }
        } else {
            //if keyboard option hasn't been chosen yet (default starting position)
            if (currentKeyboardIndex === -1) {
                if (filteredOptions.length) {
                    newKeyboardIndex = filteredOptions.length - 1;
                    newKeyboardValue = filteredOptions[newKeyboardIndex].value;
                }
            } else {
                if (currentKeyboardIndex - 1 >= 0) {
                    newKeyboardIndex = currentKeyboardIndex - 1;
                    newKeyboardValue = filteredOptions[newKeyboardIndex].value;
                }
            }
        }
        scrollOptionWindowToKeyboardSelection(newKeyboardValue);
        setCurrentKeyboardSelection(newKeyboardValue);
    };

    const scrollOptionWindowToKeyboardSelection = (newKeyboardValue) => {
        const filteredOptions = options
            .sort(sortLabelsBy)
            .filter(
                (option) =>
                    !searchInputValue ||
                    option.value === currentKeyboardSelection ||
                    option.label.toLowerCase().includes(searchInputValue.toLowerCase())
            );
        let optionIndex = options.findIndex((option) => option.value === newKeyboardValue);
        optionIndex = optionIndex === -1 && filteredOptions.length ? options.findIndex((option) => option.value === filteredOptions[0].value) : optionIndex;
        if(optionIndex === -1){
            return;
        }
        const nextOptionElement = optionRefs[optionIndex].current;
        const newOptionsScrollPosition =
            nextOptionElement.offsetTop + nextOptionElement.offsetHeight;

        //if needs to scroll off the bottom
        if (
            optionsContainerRef.current.offsetHeight + optionsContainerRef.current.scrollTop <
            newOptionsScrollPosition
        ) {
            optionsContainerRef.current.scrollTop =
                newOptionsScrollPosition - optionsContainerRef.current.offsetHeight;
            //else if scrolling off the top
        } else if (nextOptionElement.offsetTop < optionsContainerRef.current.scrollTop) {
            optionsContainerRef.current.scrollTop = nextOptionElement.offsetTop;
        }
    };

    const onSearchInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            onKeyboardEnter();
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setDropDownOpen(true);
            changeKeyboardSelection(1);
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            changeKeyboardSelection(-1);
        }
    };

    useEffect(() => {
        onExpanded(dropDownOpen ? true : false);
    }, [dropDownOpen]);

    return (
        <ClickOutside onClickOutside={onClickOutside}>
            <Wrapper className={className}>
                <SelectedValuesContainer>
                    <SearchInputWrapper>
                        <FormsIcon />
                        {dropDownOpen ? (
                            <SearchInput
                                ref={searchInputRef}
                                value={searchInputValue}
                                placeholder={placeholder}
                                onChange={onSearchInputChange}
                                onKeyDown={onSearchInputKeyDown}
                                placeholderColor={placeholderColor}
                            />
                        ) : optionHasBeenSelected && selectedOptions.length > 0 ? (
                            <SelectedValues>
                                {selectedOptions.map((Option) =>
                                    Option.component ? (
                                        <Option.component.type inSelectedValues>
                                            {Option.label}
                                        </Option.component.type>
                                    ) : (
                                        Option.label
                                    )
                                )}
                            </SelectedValues>
                        ) : (
                            <PlaceHolderValues color={placeholderColor}>
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        <LoadingTextContainer>{loadingText}</LoadingTextContainer>
                                    </>
                                ) : (
                                    placeholder
                                )}
                            </PlaceHolderValues>
                        )}
                    </SearchInputWrapper>
                    <DropDownIcon
                        dropDownOpen={dropDownOpen}
                        color={'#000'}
                        icon={dropDownIcon}
                        size={dropDownIconSize}
                    />
                    <SearchValuesOverlay
                        onClick={onSelectBoxClicked}
                        title={
                            selectedOptions
                                ? selectedOptions.map((Option) => Option.label)
                                : undefined
                        }
                    />
                </SelectedValuesContainer>
                <Transition
                    onEnter={onExpandDropDown}
                    in={dropDownOpen}
                    timeout={{
                        enter: 0,
                        exit: 400
                    }}
                    unmountOnExit
                >
                    {(animationState) => (
                        <DropDownContainer>
                            <OptionsContainer
                                ref={optionsContainerRef}
                                animationState={animationState}
                            >
                                {options.sort(sortLabelsBy).map((Option, index) => {
                                    const optionIsSelected =
                                        optionHasBeenSelected &&
                                        selectedOptions.find(
                                            (selectedOption) =>
                                                selectedOption.value === Option.value
                                        );
                                    return (
                                        <OptionContainer
                                            ref={optionRefs[index]}
                                            visible={
                                                !searchInputValue ||
                                                Option.label
                                                    .toLowerCase()
                                                    .includes(searchInputValue.toLowerCase())
                                            }
                                            keyboardFocused={
                                                Option.value === currentKeyboardSelection
                                            }
                                            selected={optionIsSelected}
                                            onClick={() => onOptionClicked(Option)}
                                            key={Option.value + index}
                                        >
                                            {Option.component ? (
                                                <Option.component.type selected={optionIsSelected}>
                                                    {Option.label}
                                                </Option.component.type>
                                            ) : (
                                                Option.label
                                            )}
                                        </OptionContainer>
                                    );
                                })}
                                <OptionContainer
                                    empty
                                    visible={
                                        !options.some((option) =>
                                            option.label
                                                .toLowerCase()
                                                .includes(searchInputValue.toLowerCase())
                                        )
                                    }
                                >
                                    No results found
                                </OptionContainer>
                            </OptionsContainer>
                        </DropDownContainer>
                    )}
                </Transition>
            </Wrapper>
        </ClickOutside>
    );
};

export default CustomSelect;
