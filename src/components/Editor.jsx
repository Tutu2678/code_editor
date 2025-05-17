import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";

const LANGUAGES = [
  {
    label: "Python",
    value: "python",
    ext: "py",
    template: 'print("Hello World")',
  },
  {
    label: "Java",
    value: "java",
    ext: "java",
    template:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
  },
  {
    label: "C++",
    value: "cpp",
    ext: "cpp",
    template:
      '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello World";\n  return 0;\n}',
  },
];

export default function Editor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [execInfo, setExecInfo] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isRunning, setIsRunning] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Update code template when language changes
  useEffect(() => {
    const saved = localStorage.getItem(`code-${language}`);
    setCode(saved || LANGUAGES.find((l) => l.value === language).template);
    setOutput("");
    setExecInfo(null);
    clearMarkers();
  }, [language]);

  // Save code to localStorage
  useEffect(() => {
    localStorage.setItem(`code-${language}`, code);
  }, [code, language]);

  // Sync Monaco theme with global app theme
  useEffect(() => {
    const applyTheme = () => {
      const appTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      const monacoTheme = ["dark", "night", "cyberpunk"].includes(appTheme)
        ? "vs-dark"
        : "light";
      setTheme(monacoTheme);
    };

    applyTheme(); // initial call

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const clearMarkers = () => {
    if (!editorRef.current || !monacoRef.current) return;
    monacoRef.current.editor.setModelMarkers(
      editorRef.current.getModel(),
      "owner",
      []
    );
  };

  const setErrorMarkers = (errorOutput) => {
    if (!editorRef.current || !monacoRef.current) return;

    const model = editorRef.current.getModel();
    const markers = [];

    const lineMatch = errorOutput.match(/line (\d+)/i);
    if (lineMatch) {
      const lineNum = parseInt(lineMatch[1], 10);
      if (!isNaN(lineNum)) {
        markers.push({
          severity: monacoRef.current.MarkerSeverity.Error,
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: model.getLineMaxColumn(lineNum),
          message: errorOutput.split("\n")[0],
        });
      }
    }

    monacoRef.current.editor.setModelMarkers(model, "owner", markers);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    setExecInfo(null);
    clearMarkers();

    try {
      const languageVersions = {
        python: "3.10.0",
        java: "15.0.2",
        cpp: "10.2.0",
      };

      const version = languageVersions[language] || "";

      if (!version) {
        setOutput("Unsupported language or version");
        setIsRunning(false);
        return;
      }

      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version,
        files: [
          {
            name: `main.${language === "cpp" ? "cpp" : language}`,
            content: code,
          },
        ],
        stdin: stdin || "",
      });

      const runData = res.data.run;
      setOutput(runData.output || "No output");
      setExecInfo({
        time: runData.time,
        memory: runData.memory,
        code: runData.code,
      });

      if (runData.code !== 0) {
        setErrorMarkers(runData.output);
      } else {
        clearMarkers();
      }
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.message || err.message));
    }

    setIsRunning(false);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.download = `code.${LANGUAGES.find((l) => l.value === language).ext}`;
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 bg-base-200 text-base-content">
        <select
          className="select select-bordered"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn btn-success btn-sm"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
          <button onClick={downloadCode} className="btn btn-warning btn-sm">
            Download Code
          </button>
        </div>
      </header>

      <main className="flex flex-grow">
        <MonacoEditor
          language={language === "cpp" ? "cpp" : language}
          theme={theme}
          value={code}
          onChange={setCode}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
          }}
          width="70%"
          editorDidMount={editorDidMount}
        />

        <section className="flex flex-col w-1/3 p-4 space-y-4 bg-base-100 text-base-content">
          <label className="font-semibold">Input (stdin):</label>
          <textarea
            className="textarea textarea-bordered flex-grow bg-base-100 text-base-content"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />

          <label className="font-semibold">Output:</label>
          <textarea
            className="textarea textarea-bordered flex-grow bg-neutral text-green-400 font-mono"
            readOnly
            value={output}
          />

          {execInfo && (
            <div className="text-sm mt-2 text-base-content">
              <p>Execution Time: {execInfo.time}s</p>
              <p>Memory Used: {execInfo.memory} KB</p>
              <p>Exit Code: {execInfo.code}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
