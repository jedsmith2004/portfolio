import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Props for `CodeBlock`.
 */
export type CodeBlockProps = SliceComponentProps<Content.CodeBlockSlice>;

/**
 * Component for "CodeBlock" Slices.
 */
const CodeBlock: FC<CodeBlockProps> = ({ slice }) => {
  const code = slice.primary.code?.map((node) => {
    if ('text' in node) {
      return node.text;
    }
    return '';
  }).join("\n") || "";
  const language = slice.primary.language || "javascript"; // Default to "javascript" if no language is provided

  return (
    <div className="max-w-prose">
      <SyntaxHighlighter language={language} style={darcula}>
        {typeof code === "string" ? code : ""}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
