'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Minus } from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`w-9 h-9 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? 'bg-forest-700 text-canvas'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({ placeholder: placeholder || 'Schrijf hier…' }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-ochre-600 underline' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-stone prose-sm max-w-none focus:outline-none min-h-[160px] px-3 py-2.5',
      },
    },
  })

  if (!editor) return null

  function setLink() {
    const url = window.prompt('URL:')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="border border-stone-300 rounded focus-within:border-amber-500 transition-colors bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-stone-200 bg-stone-50 rounded-t">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Vet">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursief">
          <Italic size={15} />
        </ToolbarButton>
        <div className="w-px bg-stone-200 mx-0.5 self-stretch" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Grote kop">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Kleine kop">
          <Heading3 size={15} />
        </ToolbarButton>
        <div className="w-px bg-stone-200 mx-0.5 self-stretch" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Opsomming">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Genummerde lijst">
          <ListOrdered size={15} />
        </ToolbarButton>
        <div className="w-px bg-stone-200 mx-0.5 self-stretch" />
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link toevoegen">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontale lijn">
          <Minus size={15} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
