import Overlay from './containers/Overlay/Overlay';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';
// import axios from 'axios';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
// import { __ } from '@wordpress/i18n';
// import { DropdownMenu } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
// import { more, arrowLeft, arrowRight, arrowUp, arrowDown } from '@wordpress/icons';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
// import { useBlockProps, BlockControls } from '@wordpress/block-editor';
// import { ToolbarGroup, ToolbarButton, ResizableBox } from '@wordpress/components';
// import { edit } from '@wordpress/icons';
import produce from 'immer';
import { buildarrayApi, buildarrayWebServerUrl, isSafeOrigin } from './api/buildarray';
import CustomSelect from './inputs/CustomSelect/CustomSelect';
import ArrayLogo from './depiction/ArrayLogo/ArrayLogo';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */

import styled from 'styled-components';
import GlobalFonts from './fonts';
import ResourcesIcon from './depiction/ResourcesIcon/ResourcesIcon';
import Icon from './depiction/Icon/Icon';

const Container = styled.div`
    z-index: 1;
    padding-top: 25px;
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

const CloseOverlay = styled.a``;

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

const ClassicEditorFormSelect = ({ attributes, setAttributes, isSelected = true, children }) => {
    const closeOverlayButtonRef = useRef(null);
    const [userAuthorized, setUserAuthorized] = useState(null);
    const [forms, setForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [inEditMode, setInEditMode] = useState(true);
    const [addingForm, setAddingForm] = useState(false);
    const [searchFormsExpanded, setSearchFormsExpanded] = useState(false);
    const [iframeErrorCode, setIframeErrorCode] = useState(null);
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

    const toggleAutomaticPTagInsertion = (toggle = 'p') => {
        //tinyMCE inserts <p> tags around anything that is at root level and not a block element.
        //we don't want this to happen, as we want Gutenberg blocks to potentially be recoverable if inserted with the classic editor.
        if (typeof tinyMCE?.activeEditor?.settings !== 'undefined') {
            tinyMCE.activeEditor.settings.forced_root_block = toggle;
        }
    };

    const insertHTMLIntoTinyMCEEditor = (html) => {
        toggleAutomaticPTagInsertion(false);
        wp.media.editor.insert(html);
    };

    const closeOverlay = () => {
        closeOverlayButtonRef?.current.click();
    };

    const onFormSelection = (selection) => {
        setSelectedForm(produce(selection, (draft) => {}));
        setAddingForm(true);
        buildarrayApi({
            method: 'post',
            endpoint: `forms/${selection.value}/public-share?enabled=1`,
            onSuccess: (data) => {
                const iframeHTML = `<!-- wp:array-block/arrayforms --><div class="wp-block-array-block-arrayforms"><iframe style="min-height: 50px; max-height: 489px; border: none; background-color: transparent;" data-form-id="${selection.value}" data-form-height="400px" src="${data.url}" width="100%" height="400" allowtransparency="true"></iframe></div><!-- /wp:array-block/arrayforms --><p><br/></p>`;
                insertHTMLIntoTinyMCEEditor(iframeHTML);
                setSelectedForm(null);
                setAddingForm(false);
                closeOverlay();
            },
            onError: (error) => {
                setIframeErrorCode(error.status);
                setAddingForm(false);
            }
        });
    };

    const navigateToPluginAdminSettings = () => {
        window.location.href = `${arrayforms_php_vars?.admin_url}admin.php?page=arrayforms`;
    };

    /**
     * Prevent clicks within the content bubbling up and closing the modal
     */
    const preventContentClicksBubbling = (event) => {
        event.stopPropagation();
    };

    const handleIncomingMessages = (event) => {
        if (event.isTrusted && isSafeOrigin(event.origin)) {
            if (typeof event.data.userAuthorized !== 'undefined') {
                setUserAuthorized(Boolean(event.data.userAuthorized) ? true : false);
            }
        } else {
            // unsafe origin
        }
    };

    const checkIfLoggedIn = () => {
        if (loggedInCheckIframe) {
            loggedInCheckIframe.contentWindow.postMessage({ isUserAuthorized: true }, '*');
        }
    };

    useEffect(() => {
        if (userAuthorized) {
            buildarrayApi({
                endpoint: 'forms',
                onSuccess: setForms,
                onLoading: setLoadingForms
            });
        }
    }, [userAuthorized]);

    useEffect(() => {
        window.addEventListener('message', handleIncomingMessages);
        checkIfLoggedIn();
        return () => {
            window.removeEventListener('message', handleIncomingMessages);
        };
    }, []);

    return (
        <Overlay>
            <CloseOverlay ref={closeOverlayButtonRef} />
            {children}
            <Container onClick={preventContentClicksBubbling}>
                <GlobalFonts />
                <Transition in={inEditMode && !addingForm} timeout={400} unmountOnExit appear>
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
            </Container>
        </Overlay>
    );
};

export default ClassicEditorFormSelect;
