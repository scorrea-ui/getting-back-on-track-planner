import { Textarea } from "flowbite-react";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ClientOnly } from "remix-utils/client-only";

interface PropsType {
  value: string;
  handleValueChange: (value: string) => void;
  inputName: string;
  inputPlaceholder: string;
}

export default function AppTextEditor({
  value,
  inputName,
  inputPlaceholder,
  handleValueChange,
}: PropsType): JSX.Element | null {
  // TODO: Fix the type of editorRef
  const editorRef = useRef<any>(null);

  return (
    <ClientOnly
      fallback={
        <Textarea
          name={inputName}
          placeholder={inputPlaceholder}
          required
          className="w-full"
        />
      }
    >
      {() =>
        typeof document !== "undefined" ? (
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey="f6q06qw1tgb5bmrpc7sjkxem6z3d0xbpxvcp4xqgclg7om8x"
            value={value}
            onEditorChange={(content) => {
              handleValueChange(content);
            }}
          />
        ) : (
          <div>Loading...</div>
        )
      }
    </ClientOnly>
  );
}
