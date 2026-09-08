import { useState } from "react";
import { Editor } from "@hosanna/chordpro/editor";
import { ChordProRenderer } from "@hosanna/chordpro/renderer";

const Home = () => {
  const [content, setContent] = useState("{title: New Song}\n[C]Hello world");

  console.log(content);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "start",
        height: "100vh",
      }}
    >
      <div style={{ width: "50%", flexBasis: "50%", height: "100%" }}>
        <Editor
          value={content}
          onChange={setContent}
          onSave={(val) => console.log("Saved:", val)}
          settings={{
            theme: "textmate",
            fontSize: 14,
            wordWrap: true,
            showLineNumbers: true,
          }}
        />
      </div>

      <div style={{ width: "50%", flexBasis: "50%", height: "100%" }}>
        <ChordProRenderer
          content={content}
          showChords={true}
          instrument="guitar"
        />
      </div>
    </div>
  );
};

export default Home;
