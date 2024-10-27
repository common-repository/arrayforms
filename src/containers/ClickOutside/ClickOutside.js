import React, { useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const propTypes = {
    /** Called when component is clicked out of */
    onClickOutside: PropTypes.func,
    /** Child content / components */
    children: PropTypes.any,
    /** used for styled components to be able to pass css classes */
    className: PropTypes.string
};

const Container = styled.div``;

/**
    Wraps with a div and creates listeners for when the component is clicked outside of
*/
const ClickOutside = ({ className = "", onClickOutside = null, children = null }) => {
    const ref = useRef(null);

    const escapeListener = useCallback(e => {
        if (e.key === "Escape") {
            if (typeof onClickOutside === "function") {
                onClickOutside();
            }
        }
    }, []);
    const clickListener = useCallback(
        e => {
            if (ref.current && !ref.current.contains(e.target)) {
                if (typeof onClickOutside === "function") {
                    onClickOutside();
                }
            }
        },
        [ref.current]
    );
    useEffect(() => {
        document.addEventListener("click", clickListener);
        document.addEventListener("keyup", escapeListener);
        return () => {
            document.removeEventListener("click", clickListener);
            document.removeEventListener("keyup", escapeListener);
        };
    }, []);

    return (
        <Container className={className} ref={ref}>
            {children}
        </Container>
    );
};

ClickOutside.propTypes = propTypes;

export default ClickOutside;
