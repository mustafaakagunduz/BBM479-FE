import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FormattedQuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface MenuButtonProps {
  onClick: () => void;
  active: boolean;
  icon: React.ElementType;
  title: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, active, icon: Icon, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      active 
        ? "bg-purple-100 text-purple-900 hover:bg-purple-200" 
        : "hover:bg-gray-100 text-gray-600"
    }`}
    title={title}
    type="button"
  >
    <Icon size={18} />
  </button>
);

const FormattedQuestionEditor: React.FC<FormattedQuestionEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your question..."
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline.configure({}),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] px-4 py-3'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="Underline"
        />
        
        <div className="w-px h-6 bg-gray-200 mx-2" />
        
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Align Center"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
        />
      </div>

      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[120px]"
      />
    </div>
  );
};

export default FormattedQuestionEditor;