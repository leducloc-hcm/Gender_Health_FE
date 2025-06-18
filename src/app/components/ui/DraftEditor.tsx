import { useEffect, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function DraftEditor({ value, onChange }: Props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  // Load giá trị ban đầu từ JSON hoặc text thường
  useEffect(() => {
    try {
      const parsed = JSON.parse(value)
      if (parsed?.blocks && Array.isArray(parsed.blocks)) {
        const content = convertFromRaw(parsed)
        setEditorState(EditorState.createWithContent(content))
      } else {
        setEditorState(EditorState.createWithContent(ContentState.createFromText(value)))
      }
    } catch {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(value)))
    }
  }, [value])

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state)
    const rawContent = convertToRaw(state.getCurrentContent())
    onChange(JSON.stringify(rawContent)) // ✅ Gửi raw JSON lên cha
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorStateChange}
      wrapperClassName='border rounded p-2 bg-white'
      editorClassName='min-h-[150px] p-2'
      toolbar={{
        options: ['inline', 'list', 'link', 'history'],
        inline: { options: ['bold', 'italic', 'underline'] },
        list: { options: ['unordered', 'ordered'] },
        link: { showOpenOptionOnHover: true }
      }}
    />
  )
}
