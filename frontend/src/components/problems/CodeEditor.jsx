import { useState } from "react";

const LANGUAGE_TEMPLATES = {
  python: `# Python solution
def solve():
    # Read input here
    pass

if __name__ == "__main__":
    solve()
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}
`,
  java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}
`
};

function CodeEditor({ value, onChange, language = "python" }) {
  const handleLanguageChange = (newLanguage) => {
    onChange(LANGUAGE_TEMPLATES[newLanguage] || "");
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}
      >
        <h3 style={{ color: "#6366f1" }}>Code Editor</h3>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#8b5cf6",
            background: "#f5f3ff",
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer"
          }}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your code here..."
        style={{
          width: "100%",
          minHeight: "320px",
          resize: "vertical",
          border: "1px solid #dbe2f0",
          borderRadius: "18px",
          padding: "16px",
          background: "#0f172a",
          color: "#e5e7eb",
          fontFamily: "Consolas, monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          outline: "none"
        }}
      />
    </div>
  );
}

export default CodeEditor;