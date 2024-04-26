import { useRef } from "react";
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

  function insertCharacter(char: string) {
    if (textareaRef.current === null) {
      return;
    }
    let content = textareaRef.current.value;
    const start = content.substring(0, textareaRef.current.selectionStart);
    const end = content.substring(textareaRef.current.selectionEnd);
    content = start + char + end;
    textareaRef.current.value = content;
    textareaRef.current.selectionStart = start.length + char.length;
    textareaRef.current.selectionEnd = start.length + char.length;
    textareaRef.current.focus();
  }
  
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
          <textarea className="edit" ref={textareaRef} defaultValue={""}></textarea>
          <div className="ime-container">
            {ime_items}
          </div>
        </div>
        <div className="view">{}</div>
      </div>
      
    </div>
  );
}

export default App;
