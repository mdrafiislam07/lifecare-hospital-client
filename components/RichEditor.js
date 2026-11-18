'use client';
import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { API_URL } from '@/lib/apiUrl';
import '@/styles/cms.css';

// Rich text editor (Tiptap) + Cloudinary image upload. Value = HTML string.
// Page switch korle parent e key={...} diye remount korben.
export default function RichEditor({ value, onChange, token }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: { attributes: { class: 'rich rich-edit', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Page content' } }
  });

  if (!editor) return <div className="rich-box" style={{ padding: 14 }}>Editor load hocche…</div>;

  const setLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Link URL (https://… , mailto:… , tel:… ba /page-path). Khali dile link muche jabe:', prev);
    if (url === null) return;
    if (url.trim() === '') return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(url.trim())) return setErr('Link https://, mailto:, tel: ba / diye shuru hote hobe');
    setErr('');
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim(), target: url.trim().startsWith('/') ? null : '_blank' }).run();
  };

  const upload = async (file) => {
    if (!file) return;
    setErr(''); setBusy(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const r = await fetch(`${API_URL}/upload/image?folder=gallery`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j.message || 'Upload hoyni');
      const src = j.url.replace('/upload/', '/upload/w_1200,c_limit,q_auto,f_auto/');
      editor.chain().focus().setImage({ src, alt: file.name.replace(/\.[^.]+$/, '') }).run();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const B = ({ on, active, label, children, disabled }) => (
    <button type="button" className={`rt-btn ${active ? 'on' : ''}`} title={label} aria-label={label} aria-pressed={!!active} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={on}>{children}</button>
  );
  const c = () => editor.chain().focus();

  return (
    <div>
      <div className="rich-box">
        <div className="rt-bar" role="toolbar" aria-label="Formatting">
          <B label="Bold" active={editor.isActive('bold')} on={() => c().toggleBold().run()}><b>B</b></B>
          <B label="Italic" active={editor.isActive('italic')} on={() => c().toggleItalic().run()}><i>I</i></B>
          <B label="Underline" active={editor.isActive('underline')} on={() => c().toggleUnderline().run()}><u>U</u></B>
          <B label="Heading" active={editor.isActive('heading', { level: 2 })} on={() => c().toggleHeading({ level: 2 }).run()}>H2</B>
          <B label="Sub heading" active={editor.isActive('heading', { level: 3 })} on={() => c().toggleHeading({ level: 3 }).run()}>H3</B>
          <B label="Bullet list" active={editor.isActive('bulletList')} on={() => c().toggleBulletList().run()}>• List</B>
          <B label="Numbered list" active={editor.isActive('orderedList')} on={() => c().toggleOrderedList().run()}>1. List</B>
          <B label="Quote" active={editor.isActive('blockquote')} on={() => c().toggleBlockquote().run()}>❝</B>
          <B label="Link" active={editor.isActive('link')} on={setLink}>🔗</B>
          <B label="Image upload (Cloudinary)" disabled={busy} on={() => fileRef.current?.click()}>{busy ? '…' : '🖼 Image'}</B>
          <B label="Undo" disabled={!editor.can().undo()} on={() => c().undo().run()}>↶</B>
          <B label="Redo" disabled={!editor.can().redo()} on={() => c().redo().run()}>↷</B>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => upload(e.target.files?.[0])} />
        </div>
        <EditorContent editor={editor} />
      </div>
      {err && <p role="alert" style={{ color: '#b91c1c', margin: '6px 0 0' }}>{err}</p>}
    </div>
  );
}
