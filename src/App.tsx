import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

const ime_characters = [
  {id: 1, chara: '─'}, 
  {id: 2, chara: '│'}, 
  {id: 3, chara: '┌'}, 
  {id: 4, chara: '┐'}, 
  {id: 5, chara: '┘'}, 
  {id: 6, chara: '└'}, 
  {id: 7, chara: '├'}, 
  {id: 8, chara: '┬'}, 
  {id: 9, chara: '┤'}, 
  {id: 10, chara: '┴'}, 
  {id: 11, chara: '•'}, 
  {id: 12, chara: '@'}, 
  {id: 13, chara: '/'}
];
function App() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState("");

  async function echo() {
    setContent(await invoke("echo", { content }));
  }

  useEffect(() => { echo() }, [content]);

  const insertCharacter = useCallback(
    (character: string) => {
      if (textareaRef.current) {
        const start = content.substring(0, textareaRef.current.selectionStart);
        const end = content.substring(textareaRef.current.selectionEnd);
        const cursorPos = textareaRef.current.selectionStart; // カーソル位置を取得
        const newContent = start + character + end;
        setContent(newContent);
        const newCursorPos = cursorPos + character.length; // 新しいカーソル位置を計算
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
        console.log([cursorPos, newCursorPos]);
      }
    }, [content]);
  
  const ime_items = ime_characters.map(chara =>
    <button
      key={chara.id}
      onClick={() => insertCharacter(chara.chara)}
      >
        {chara.chara}
    </button>
  )

  return (
    <div className="container">

      <div className="editor-container">
        <div>
          <textarea className="edit" ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          <div className="ime-container">
            {ime_items}
          </div>
        </div>
        <div className="view">{content}</div>
      </div>
      
    </div>
  );
}

export default App;
