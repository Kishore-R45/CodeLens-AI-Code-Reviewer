import React, { useState } from 'react'
import "./App.css"
import Navbar from './Components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown'
import SyncLoader from "react-spinners/SyncLoader";

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      color: '#fff',
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: '#fff',
      width: "100%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#18181b',
      color: '#fff',
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa',
      width: "100%"
    }),
  };

  const [code, setCode] = useState("");
  const ai = new GoogleGenAI({ apiKey: import.meta.env.GOOGLE_API_KEY });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  // ✅ Review code
  async function reviewCode() {
    setResponse("")
    setLoading(true);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an expert-level software developer.
I’m sharing a piece of code written in ${selectedOption.value}.
Please review it and provide:

- Quality rating
- Suggestions for improvement
- Step-by-step explanation
- Potential bugs, errors
- Fix recommendations

Code: ${code}
`,
      });
      setResponse(res.text);
    } catch (err) {
      setResponse("⚠️ Error while reviewing code: " + err.message);
    }
    setLoading(false);
  }

  // ✅ Fix code
  async function fixCode() {
    if (!code) {
      alert("Please enter code first");
      return;
    }
    setResponse("")
    setLoading(true);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an expert-level software developer.
I’m sharing a piece of code written in ${selectedOption.value}.
Please fix/improve the code and return the corrected version only, without extra explanation.

Code: ${code}
`,
      });
      setCode(res.text); // 👈 Replace editor code with fixed version
      setResponse("✅ Code has been fixed and updated in the editor!");
    } catch (err) {
      setResponse("⚠️ Error while fixing code: " + err.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 75px)" }}>
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />
            <button 
              onClick={fixCode}
              className="btnNormal bg-zinc min-w-[120px] transition-all hover:bg-zinc-800" style={{border: "1px solid gray"}}>
              Fix Code
            </button>
            <button 
              onClick={reviewCode} 
              className="btnNormal bg-zinc min-w-[120px] transition-all hover:bg-zinc-800" style={{border: "1px solid gray"}}>
              Review
            </button>
          </div>

          <Editor
            height="100%"
            theme="vs-dark"
            language={selectedOption.value}
            value={code}
            onChange={(e) => setCode(e)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              placeholder: "# write or paste your code here",
            }}
          />
        </div>

        <div className="right relative overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[101%]">
          <div className="topTab border-b-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-80">
              <SyncLoader color='#9333ea'/>
            </div>
          )}

          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  )
}

export default App
