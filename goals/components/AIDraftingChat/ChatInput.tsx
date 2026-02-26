import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { useEffect } from 'react';
import HardBreak from '@tiptap/extension-hard-break';

const styles = {
  chatInput: css({
    width: '100%',
    '& .ProseMirror': {
      border: `1px solid ${palette.neutrals.gray200}`,
      borderRadius: '0.5rem',
      padding: '0.5rem',
      width: '100%',
    },
    '.tiptap p.is-editor-empty:first-child::before': {
      color: palette.neutrals.gray300,
      content: 'attr(data-placeholder)',
      float: 'left',
      height: '0',
      pointerEvents: 'none',
    },
  }),
};

const AIChatInput = ({
  content,
  onChange,
  handleSubmit,
}: {
  content: string;
  onChange: (content: string) => void;
  handleSubmit: () => void;
}): JSX.Element => {
  const editor = useEditor({
    extensions: [StarterKit, HardBreak, Placeholder.configure({
      placeholder: 'Type your message...',
    })],
    parseOptions: {
      preserveWhitespace: 'full' as const,
    },
    content,
    editable: true,
    injectCSS: false,
    autofocus: 'end',
    onUpdate: ({ editor: editorUpdate }) => onChange(editorUpdate?.getText() ?? ''),
    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
            return true;
          }
          if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
  }, []);

  useEffect(() => {
    if (!editor) return;

    if (content === '' && editor.getText() !== '') {
      editor.commands.clearContent();
      editor.commands.focus('end');
    }
  }, [content, editor]);

  if (!editor) {
    return <div>Chat Input</div>;
  }

  return (
    <div css={styles.chatInput}>
      <EditorContent editor={editor} />
    </div>
  );
};

export { AIChatInput };
