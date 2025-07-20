import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
  FontColor,
  Base64UploadAdapter,
  ImageInsert,
  Image,
  Alignment
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

export default function CKEditor5({ setEditorRef, data, onChange, onBlur }) {
  return (
    <CKEditor
      editor={ClassicEditor}

      onReady={(editor) => {
        setEditorRef(editor);
        if (data) {
          editor.setData(data);
        }
      }}
      
      onChange={(event, editor) => {
        if (onChange) {
          const data = editor.getData();
          onChange(event, data);
        }
      }}
      
      onBlur={(event, editor) => {
        if (onBlur) {
          const data = editor.getData();
          onBlur(event, data);
        }
      }}
      config={{
        plugins: [
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          MediaEmbed,
          Paragraph,
          Table,
          Undo,
          FontColor,
          Base64UploadAdapter,
          Image,
          ImageInsert,
          Alignment
        ],
        toolbar: [
          'undo', 'redo', '|',
          'heading', '|', 'bold', 'italic', 'fontColor', 'alignment', '|',
          'link', 'insertTable', 'mediaEmbed', 'insertImage', '|',
          'bulletedList', 'numberedList', 'indent', 'outdent'
        ],
        initialData: '',
      }}
    />
  )
}