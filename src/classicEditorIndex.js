import ClassicEditorFormSelect from './ClassicEditorFormSelect';
import AddFormMediaButton from './inputs/AddFormMediaButton/AddFormMediaButton';

const editorFormSelect = document.getElementById('arrayforms-classic-editor-form-select');
const editorFormSelectButton = document.getElementById(
    'arrayforms-classic-editor-add-form-media-button'
);

if (editorFormSelect && editorFormSelectButton) {
    wp.element.render(
        <ClassicEditorFormSelect>
            {wp.element.createPortal(<AddFormMediaButton />, editorFormSelectButton)}
        </ClassicEditorFormSelect>,
        editorFormSelect
    );
}
