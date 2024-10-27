import { useEffect, useState, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
// import { DropdownMenu } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
// import { more, arrowLeft, arrowRight, arrowUp, arrowDown } from '@wordpress/icons';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, ResizableBox } from '@wordpress/components';
import { edit, link } from '@wordpress/icons';
import produce from 'immer';
import {
    buildarrayApi,
    buildarrayWebServerUrl,
    getFormPreviewUrl,
    isSafeOrigin
} from './api/buildarray';
import CustomSelect from './inputs/CustomSelect/CustomSelect';
import ArrayLogo from './depiction/ArrayLogo/ArrayLogo';
import arraySvgs from '../assets/images/icon';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */

import styled, { StyleSheetManager } from 'styled-components';
import GlobalFonts from './fonts';
import ResourcesIcon from './depiction/ResourcesIcon/ResourcesIcon';
import Icon from './depiction/Icon/Icon';
import LoadingSpinner from './status/LoadingSpinner/LoadingSpinner';

const Container = styled.div`
    z-index: 1;
`;

const IframeContainer = styled.div`
    position: relative;
    min-height: 50px;
    transition: 0.4s opacity, 0.4s min-height, 0.4s height;
    ${({ animationState, inEditMode }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    ${inEditMode
                        ? `
                        overflow:hidden;
                        min-height:50px;`
                        : ``
                    }
                `;
            case 'entered':
                return `
                    opacity:1;
                    ${inEditMode
                        ? `
                        overflow:hidden;
                        min-height:50px;`
                        : ``
                    }
                `;
            case 'exiting':
                return `
                    opacity:0;
                    ${inEditMode
                        ? `
                        overflow:hidden;
                        min-height:331px;`
                        : ``
                    }
                 `;
            case 'exited':
                return `
                    opacity:0;
                    ${inEditMode ? `overflow:hidden;min-height:331px;` : ``}
                `;
        }
    }};
`;

const FormIframe = styled.iframe`
    min-height: 50px;
    width: 100%;
    ${({ width, height }) =>
        width
            ? `
        width: ${width};
        height: ${height};
    `
            : `
        height: 100%;
    `}
    transition: opacity 0.4s;
    ${({ visible }) => (visible ? `opacity:1;` : `opacity:0;`)}
`;

const IframeOverlay = styled.div`
    z-index: 1;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;

const Logo = styled(ArrayLogo)`
    margin: 0 auto 20px auto;
`;

const LargeIcon = styled(ResourcesIcon)`
    margin: 0 auto 20px auto;
`;

const FormSelectMainContainer = styled.div`
    z-index: 1;
    position: absolute;
    width: 100%;
    transition: 0.4s max-height, 0.4s opacity, 0.4s padding-top;
    ${({ animationState }) => {
        switch (animationState) {
            case 'entering':
                return `
                    opacity:0;
                    padding-top:0px;
                `;
            case 'entered':
                return `
                    opacity:1;
                    padding-top:10px;
                `;
            case 'exiting':
                return `
                    opacity:0;
                    padding-top:0px;
                `;
            case 'exited':
                return `
                    display: none;
                    opacity:0;
                    padding-top:0px;
                `;
        }
    }};
`;

const FormSelectContainer = styled.div`
    z-index: 1;
    position: relative;
    display: flex;
    justify-content: center;
`;

const FormSelectOuter = styled.div`
    padding: 6px 8px 8px 8px;
    background-color: #ec7965;
    border-radius: 9px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.24);
    transition: border-radius 0.2s;
    ${({ expanded }) =>
        expanded
            ? `
        border-radius: 9px 9px 0px 0px;
    `
            : ``}
`;

const FormSelectTitle = styled.div`
    margin: 0 0 4px 0;
    font-family: 'Poppins';
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: #541207;
`;

const FormSelect = styled(CustomSelect)`
    width: 260px;
`;

const FooterLink = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
`;

const LoginPrompt = styled.div`
    margin: 0 0 4px 0;
    font-family: 'Poppins';
    font-size: 12px;
    font-weight: 600;
    text-align: center;
`;

const LearnMoreLink = styled.a`
    display: flex;
    padding: 0 10px;
    font-size: 14px;
    color: #0084ff !important;
    text-decoration: none;
`;

const LearnMoreIcon = styled(Icon)`
    margin-left: 10px;
    color: #0084ff !important;
`;

const Tooltip = styled.div`
    z-index: 2;
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 2px 8px;
    border-radius: 6px;
    background-color: #0084ff;
    color: #fff;
    font-family: 'Poppins';
    font-size: 11px;
    font-weight: 600;
    transition: 0.4s max-height, 0.4s opacity, 0.4s padding-top;
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
                    opacity:0;
                `;
        }
    }};
`;

const IframeLoadingSpinner = styled(LoadingSpinner)`
    transition: 0.4s opacity;
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
                    opacity:0;
                `;
        }
    }};
`;

const ErrorMessage = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins';
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background-color: #f6860e;
`;

const ArrayIcon = styled.div`
    width: 180px;
    height: 50px;
    margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const GoToAdminButton = styled.span`
    cursor: pointer;
    margin: 20px 0;
    padding: 7px 20px;
    height: auto;
    justify-content: center;
    background-color: #0d3bc9;
    color: #fff;
    font-family: 'Poppins';
    font-size: 15px;
    border-radius: 12px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.32);
    transition: box-shadow 0.4s;
    &:hover {
        box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    }
`;

const FormListItem = styled.div`
    padding-left: 30px;
    background-position: center left;
    background-size: 17px;
    background-repeat: no-repeat;
    transition: 0.3s background-image;
    ${({ selected }) =>
        selected
            ? `
        background-image: url('${buildarrayWebServerUrl}/imgs/icon/selected-right-arrow.svg');
    `
            : `
        background-image: url('${buildarrayWebServerUrl}/imgs/icon/forms-grey.svg');
    `};
    ${({ inSelectedValues }) =>
        inSelectedValues &&
        `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-image:none;
        padding-left:0;
    `}
`;
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

const nonce = arrayforms_php_vars?.nonce;
apiFetch.use(apiFetch.createNonceMiddleware(nonce));

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const blockProps = useBlockProps();
    const iframeRef = useRef(null);

    const [forms, setForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedFormUrl, setSelectedFormUrl] = useState(null);
    const [inEditMode, setInEditMode] = useState(false);
    const [addingForm, setAddingForm] = useState(false);
    const [searchFormsExpanded, setSearchFormsExpanded] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [currentResizeHeight, setCurrentResizeHeight] = useState(0);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeErrorCode, setIframeErrorCode] = useState(null);
    const [formPreviewSrc, setFormPreviewSrc] = useState(null);
    const [userAuthorized, setUserAuthorized] = useState(null);
    const [formIsInCurrentAccount, setFormIsInCurrentAccount] = useState(null);
    const loggedInCheckIframe = document.getElementById('arrayforms-logged-in-check');

    const availableForms = useMemo(() => {
        if (forms instanceof Array) {
            return forms.map((form) => ({
                value: form.id,
                label: form.name,
                component: <FormListItem>{form.name}</FormListItem>
            }));
        } else {
            return [];
        }
    }, [forms]);

    const onFormSelection = (selection) => {
        setSelectedForm(produce(selection, (draft) => { }));
        setAddingForm(true);
        buildarrayApi({
            method: 'post',
            endpoint: `forms/${selection.value}/public-share?enabled=1`,
            onSuccess: (data) => {
                setFormPreviewSrc(getFormPreviewUrl({ formId: selection.value }));
                setSelectedForm(produce(selection, (draft) => { }));
                setSelectedFormUrl(data.url);
                setAddingForm(false);
            },
            onLoadingStart: () => setIframeLoading(true),
            onError: (error) => {
                setIframeLoading(false);
                setIframeErrorCode(error.status);
                setAddingForm(false);
            }
        });
        setInEditMode(false); //close select input when a form is selected
    };

    const navigateToPluginAdminSettings = () => {
        window.location.href = `${arrayforms_php_vars?.admin_url}admin.php?page=arrayforms`;
    };

    const navigateToEditForm = (formId) => {
        if (formIsInCurrentAccount) {
            window.location.href = `${arrayforms_php_vars?.admin_url}admin.php?page=arrayforms&arrayforms_editFormId=${formId}`;
        } else {
            alert(
                "This form isn't available to edit on your currently logged in Array account.\nTo edit this form, you must login to the Array account it's associated with."
            );
        }
    };

    useEffect(() => {
        let selectedFormWhenLoaded = null;
        if (attributes.formEmbedId) {
            selectedFormWhenLoaded = availableForms.find(
                (form) => form.value == attributes.formEmbedId
            );
        }
        if (typeof selectedFormWhenLoaded !== 'undefined') {
            setFormIsInCurrentAccount(true);
            setSelectedForm(produce(selectedFormWhenLoaded, (draft) => { }));
        } else {
            setFormIsInCurrentAccount(false);
        }
    }, [availableForms]);

    useEffect(() => {
        if (selectedFormUrl) {
            setAttributes({ formEmbedId: selectedForm.value, formEmbedUrl: selectedFormUrl });
        } else {
            //remove form
        }
    }, [selectedFormUrl]);

    /**
     * Listen to when block loses focus
     */
    useEffect(() => {
        if (!isSelected) {
            setInEditMode(false);
        }
    }, [isSelected]);

    useEffect(() => {
        //load all forms once user is authorized
        if (userAuthorized) {
            buildarrayApi({
                endpoint: 'forms',
                onSuccess: setForms,
                onLoading: setLoadingForms
            });
        }
    }, [userAuthorized]);

    const onIframeLoaded = (event) => {
        setIframeLoading(false);
    };

    const addIframeListeners = () => {
        iframeRef.current?.addEventListener('load', onIframeLoaded, true);
    };

    const removeIframeListeners = () => {
        iframeRef.current?.removeEventListener('load', onIframeLoaded, true);
    };

    useEffect(() => {
        if (iframeRef?.current) {
            addIframeListeners();
            return removeIframeListeners;
        }
    }, [iframeRef, iframeRef?.current]);

    useEffect(() => {
        if (userAuthorized && attributes.formEmbedId) {
            setFormPreviewSrc(getFormPreviewUrl({ formId: attributes.formEmbedId }));
        }
    }, [userAuthorized, attributes.formEmbedId]);

    const handleIncomingMessages = (event) => {
        if (event.isTrusted && isSafeOrigin(event.origin)) {
            if (typeof event.data.userAuthorized !== 'undefined') {
                setUserAuthorized(Boolean(event.data.userAuthorized) ? true : false);
            }
        } else {
            // unsafe origin
        }
    };

    const onResizeBoxStart = () => {
        setIsResizing(true);
        setCurrentResizeHeight(parseInt(attributes.formHeight));
    };
    const onResizeBoxStop = (event, direction, elt, delta) => {
        const newFormHeight = parseInt(attributes.formHeight) + delta.height;
        setAttributes({
            formHeight: newFormHeight + 'px'
        });
        setIsResizing(false);
    };
    const onResizeBox = (event, direction, elt, delta) => {
        setCurrentResizeHeight(parseInt(attributes.formHeight) + delta.height);
    };

    const checkIfLoggedIn = () => {
        if (loggedInCheckIframe) {
            loggedInCheckIframe.contentWindow.postMessage({ isUserAuthorized: true }, '*');
        }
    };

    useEffect(() => {
        window.addEventListener('message', handleIncomingMessages);
        checkIfLoggedIn();
        return () => {
            window.removeEventListener('message', handleIncomingMessages);
        };
    }, []);

    //inject styled component style tags into WordPress Tablet / Mobile preview if viewing in there
    const injectStylesHere = document.getElementsByClassName('editor-styles-wrapper')[0] || document.querySelector('.block-editor__container iframe')?.contentWindow.document.getElementsByTagName('head')[0];

    return (
        <StyleSheetManager target={injectStylesHere}>
            <Container {...blockProps}>
                <GlobalFonts />
                {attributes.formEmbedId !== '' && userAuthorized && (
                    <BlockControls>
                        <ToolbarGroup>
                            <ToolbarButton
                                icon={link}
                                label="Select Form"
                                onClick={() => setInEditMode(true)}
                            />
                            <ToolbarButton
                                icon={edit}
                                label="Edit Form"
                                onClick={() => navigateToEditForm(attributes.formEmbedId)}
                            />
                        </ToolbarGroup>
                    </BlockControls>
                )}
                <Transition
                    in={
                        attributes.isPreview === false &&
                        (attributes.formEmbedId === '' || inEditMode) &&
                        !addingForm
                    }
                    timeout={400}
                    unmountOnExit
                    appear
                >
                    {(animationState) => (
                        <FormSelectMainContainer animationState={animationState}>
                            <Logo animationState={animationState} />
                            {userAuthorized === true &&
                                ((forms instanceof Array && forms.length > 0) || loadingForms ? (
                                    <FormSelectContainer>
                                        <FormSelectOuter expanded={searchFormsExpanded}>
                                            <FormSelectTitle>Public Forms</FormSelectTitle>
                                            <FormSelect
                                                isSearchable
                                                value={selectedForm}
                                                onChange={onFormSelection}
                                                options={availableForms}
                                                loading={loadingForms}
                                                loadingText={'Loading Forms ...'}
                                                placeholder={'Search Forms'}
                                                onExpanded={setSearchFormsExpanded}
                                                dropDownIcon={0xf1c3}
                                                dropDownIconSize={'21px'}
                                            />
                                        </FormSelectOuter>
                                    </FormSelectContainer>
                                ) : (
                                    <ButtonContainer>
                                        <GoToAdminButton onClick={navigateToPluginAdminSettings}>
                                            Add New Form
                                        </GoToAdminButton>
                                    </ButtonContainer>
                                ))}
                            {userAuthorized === false && (
                                <ButtonContainer>
                                    <GoToAdminButton onClick={navigateToPluginAdminSettings}>
                                        Login / Signup
                                    </GoToAdminButton>
                                </ButtonContainer>
                            )}
                            {userAuthorized === null && <LoadingSpinner />}
                            <LargeIcon animationState={animationState} />
                            <FooterLink>
                                <LearnMoreLink
                                    href={'https://docs.buildarray.com/en/forms'}
                                    target={'_blank'}
                                >
                                    Learn more about forms <LearnMoreIcon icon={0xf1a3} />
                                </LearnMoreLink>
                            </FooterLink>
                        </FormSelectMainContainer>
                    )}
                </Transition>
                <Transition
                    in={
                        attributes.isPreview === false &&
                        attributes.formEmbedId !== '' &&
                        !inEditMode &&
                        (userAuthorized === false || formIsInCurrentAccount === false)
                    }
                    timeout={400}
                    unmountOnExit
                >
                    {(animationState) => (
                        <FormSelectMainContainer animationState={animationState}>
                            <Logo animationState={animationState} />
                            {formIsInCurrentAccount === false ? (
                                <>
                                    <LoginPrompt>To view this form preview,</LoginPrompt>
                                    <LoginPrompt>
                                        please login to the Array account this form is associated with
                                    </LoginPrompt>
                                </>
                            ) : (
                                <LoginPrompt>
                                    To view this form preview, please login to Array
                                </LoginPrompt>
                            )}
                            <ButtonContainer>
                                <GoToAdminButton onClick={navigateToPluginAdminSettings}>
                                    Login
                                </GoToAdminButton>
                            </ButtonContainer>
                            <LargeIcon animationState={animationState} />
                            <FooterLink>
                                <LearnMoreLink
                                    href={'https://docs.buildarray.com/en/forms'}
                                    target={'_blank'}
                                >
                                    Learn more about forms <LearnMoreIcon icon={0xf1a3} />
                                </LearnMoreLink>
                            </FooterLink>
                        </FormSelectMainContainer>
                    )}
                </Transition>
                <Transition
                    in={
                        attributes.isPreview === false &&
                        attributes.formEmbedId !== '' &&
                        !inEditMode &&
                        userAuthorized &&
                        formIsInCurrentAccount
                    }
                    timeout={400}
                >
                    {(animationState) => (
                        <IframeContainer animationState={animationState} inEditMode={inEditMode}>
                            <ResizableBox
                                size={{
                                    height: attributes.formHeight
                                }}
                                minHeight="50"
                                minWidth="50"
                                enable={{
                                    top: false,
                                    right: false,
                                    bottom: true,
                                    left: false,
                                    topRight: false,
                                    bottomRight: false,
                                    bottomLeft: false,
                                    topLeft: false
                                }}
                                onResizeStart={onResizeBoxStart}
                                onResizeStop={onResizeBoxStop}
                                onResize={onResizeBox}
                                showHandle={attributes.isPreview === false && isSelected}
                            >
                                <FormIframe
                                    ref={iframeRef}
                                    visible={
                                        attributes.isPreview ||
                                        (formPreviewSrc !== null && !iframeLoading)
                                    }
                                    {...(attributes.isPreview
                                        ? {
                                            width: attributes.formWidth,
                                            height: attributes.formHeight
                                        }
                                        : {})}
                                    data-form-id={attributes.formEmbedId}
                                    src={
                                        attributes.isPreview ? attributes.formEmbedUrl : formPreviewSrc
                                    }
                                    allowtransparency
                                />
                                {(!isSelected || iframeLoading || iframeErrorCode !== null) && (
                                    <IframeOverlay>
                                        <Transition
                                            in={iframeLoading && iframeErrorCode === null}
                                            timeout={400}
                                            unmountOnExit
                                        >
                                            {(animationState) => (
                                                <IframeLoadingSpinner animationState={animationState} />
                                            )}
                                        </Transition>
                                        {iframeErrorCode !== null && (
                                            <ErrorMessage>
                                                <ArrayIcon>{arraySvgs['array-icon']('#fff')}</ArrayIcon>
                                                {iframeErrorCode === 404 && (
                                                    <span>
                                                        The embedded form is no longer available
                                                    </span>
                                                )}
                                                {iframeErrorCode === 401 && (
                                                    <>
                                                        <span>Session timed out, please re-login</span>
                                                        <ButtonContainer>
                                                            <GoToAdminButton
                                                                onClick={navigateToPluginAdminSettings}
                                                            >
                                                                Login
                                                            </GoToAdminButton>
                                                        </ButtonContainer>
                                                    </>
                                                )}
                                                {iframeErrorCode === 500 && (
                                                    <>
                                                        <span>{`There is a ${buildarrayWebServerUrl} server problem`}</span>
                                                        <span>
                                                            We apologise for any inconvenience caused,
                                                            we are working on fixing it.
                                                        </span>
                                                    </>
                                                )}
                                            </ErrorMessage>
                                        )}
                                    </IframeOverlay>
                                )}
                                <Transition in={isResizing} timeout={400} unmountOnExit>
                                    {(animationState) => (
                                        <Tooltip animationState={animationState}>
                                            {currentResizeHeight}px
                                        </Tooltip>
                                    )}
                                </Transition>
                            </ResizableBox>
                        </IframeContainer>
                    )}
                </Transition>
            </Container>
        </StyleSheetManager>
    );
};

export default Edit;
