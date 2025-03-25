import { Tooltip } from "@mantine/core";
import { KeyboardEvent, useCallback, useRef, useState } from "react";

interface ANSIState {
  fg: number;
  bg: number;
  st: number;
}



type ButtonState = typeof BUTTON_STATES[keyof typeof BUTTON_STATES];

const BUTTON_STATES = {
  DEFAULT: "Copy text as Discord formatted",
  COPIED: "Copied!",
  ERROR: "Failed to copy"
} as const;

const Content: React.FC<object> = () => {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [copyButtonText, setCopyButtonText] = useState<ButtonState>(BUTTON_STATES.DEFAULT);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const copyBtn = copyButtonRef.current;
    // Early return if refs are null
    if (!textAreaRef.current || !copyBtn) return;

    const toCopy =
      "```ansi\n" +
      nodesToANSI(textAreaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) +
      "\n```";

    // Copy to clipboard
    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        setCopyButtonText(BUTTON_STATES.COPIED);
        setIsCopied(true);
        setTimeout(() => {
          copyBtn.innerText = BUTTON_STATES.DEFAULT;
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Copy failed:", error);
        alert(BUTTON_STATES.ERROR);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array since we're only using refs

  function handleInput() {
    if (textAreaRef.current) {
      const base = textAreaRef.current.innerHTML.replace(
        /<(\/?(br|span|span class="ansi-[0-9]*"))>/g,
        "[$1]",
      );
      if (base.includes("<") || base.includes(">")) {
        textAreaRef.current.innerHTML = base
          .replace(/<.*?>/g, "")
          .replace(/[<>]/g, "")
          .replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g, "<$1>");
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);

        // Set cursor position after the break
        range.setStartAfter(br);
        range.collapse(true);

        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Get the clicked button
    const btn = event.currentTarget;
    const ansiValue = btn.dataset.ansi;

    // Early return if no ansi value
    if (!ansiValue) {
      return;
    }

    // Get the selection from window instead of hook
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    // Get selected text
    const text = selection.toString();
    if (!text) {
      return;
    }

    try {
      // Create and configure span element
      const span = document.createElement("span");
      span.textContent = text;
      span.classList.add(`ansi-${ansiValue}`);

      // Replace selected content with new span
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);

      // Update selection to new span
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);

      // Force input event to trigger sanitization
      const inputEvent = new Event("input", { bubbles: true });
      textAreaRef.current?.dispatchEvent(inputEvent);
    } catch (error) {
      console.error("Failed to apply formatting:", error);
    }
  }

  function nodesToANSI(
    nodes: NodeListOf<ChildNode> | HTMLCollection,
    states: ANSIState[],
  ): string {
    let text = "";
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
        continue;
      }
      if (node instanceof HTMLElement) {
        if (node.nodeName === "BR") {
          text += "\n";
          continue;
        }
        const ansiCode = +node.className.split("-")[1];
        const newState = { ...states[states.length - 1] };

        if (ansiCode < 30) newState.st = ansiCode;
        if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
        if (ansiCode >= 40) newState.bg = ansiCode;

        states.push(newState);
        text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
        text += nodesToANSI(node.childNodes, states);
        states.pop();
        text += `\x1b[0m`;

        const currentState = states[states.length - 1];
        if (currentState.fg !== 2) {
          text += `\x1b[${currentState.st};${currentState.fg}m`;
        }
        if (currentState.bg !== 2) {
          text += `\x1b[${currentState.st};${currentState.bg}m`;
        }
      }
    }
    return text;
  }

  const textStyleButtons = [
    { dataAnsi: 0, class: "", text: "Reset" },
    { dataAnsi: 1, class: "ansi-1", text: "Bold" },
    { dataAnsi: 4, class: "ansi-4", text: "Underline" },
  ];

  const foreGroundColorButtons = [
    {
      dataAnsi: 30,
      toolTipText: "Dark Gray (33%)",
      class: " ansi-30-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 31,
      toolTipText: "Red",
      class: " ansi-31-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 32,
      toolTipText: "Yellowish Green",
      class: " ansi-32-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 33,
      toolTipText: "Gold",
      class: " ansi-33-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 34,
      toolTipText: "Light Blue",
      class: " ansi-34-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 35,
      toolTipText: "Pink",
      class: " ansi-35-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 36,
      toolTipText: "Teal",
      class: " ansi-36-bg",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 37,
      toolTipText: "White",
      class: " ansi-37-bg",
      text: <>&nbsp</>,
    },
  ];

  const backGroundColorButtons = [
    {
      dataAnsi: 40,
      toolTipText: "Blueish Black",
      class: " ansi-40",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 41,
      toolTipText: "Rust Brown",
      class: " ansi-41",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 42,
      toolTipText: "Gray (40%)",
      class: " ansi-42",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 43,
      toolTipText: "Gray (45%)",
      class: " ansi-43",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 44,
      toolTipText: "Light Gray (55%)",
      class: " ansi-44",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 45,
      toolTipText: "Blurple",
      class: " ansi-45",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 46,
      toolTipText: "Light Gray (60%)",
      class: " ansi-46",
      text: <>&nbsp</>,
    },
    {
      dataAnsi: 47,
      toolTipText: "Cream White",
      class: " ansi-47",
      text: <>&nbsp</>,
    },
  ];

  return (
    <div>
      {/* Button Console */}
      <div className="mx-auto w-[70%]">
        {/* text style btns */}
        <div>
          {textStyleButtons.map((style, index) => (
            <button
              key={index}
              data-ansi={style.dataAnsi}
              className={`${style.class}`}
              onClick={(event) => handleClick(event)}
            >
              {style.text}
            </button>
          ))}
        </div>

        {/* foreground color btns */}
        <div>
          fore ground color btns
          {foreGroundColorButtons.map((fgClr, index) => (
            <Tooltip key={index} label={fgClr.toolTipText}>
              <button
                data-ansi={fgClr.dataAnsi}
                className={`size-12 rounded-md ${fgClr.class}`}
                onClick={(event) => handleClick(event)}
              >
                <span className="hidden">{fgClr.text}</span>
              </button>
            </Tooltip>
          ))}
        </div>

        {/* background color btns */}
        <div>
          back ground color btns
          {backGroundColorButtons.map((bgClr, index) => (
            <Tooltip key={index} label={bgClr.toolTipText}>
              <button
                data-ansi={bgClr.dataAnsi}
                className={`size-12 rounded-md ${bgClr.class}`}
                onClick={(event) => handleClick(event)}
              >
                <span className="hidden">{bgClr.text}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="mx-auto w-min min-w-1/2">
        <div className="flex">
          <div
            ref={textAreaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            contentEditable="true"
            className="h-56 w-2xl rounded-xl border bg-[#383a40] p-4"
          >
            Welcome to&nbsp;<span className="ansi-33">Rebane</span>'s{" "}
            <span className="ansi-45">
              <span className="ansi-37">Discord</span>
            </span>
            &nbsp;<span className="ansi-31">C</span>
            <span className="ansi-32">o</span>
            <span className="ansi-33">l</span>
            <span className="ansi-34">o</span>
            <span className="ansi-35">r</span>
            <span className="ansi-36">e</span>
            <span className="ansi-37">d</span>&nbsp;Text Generator!
          </div>
        </div>

        <button 
          ref={copyButtonRef} 
          onClick={handleCopy}
          className={isCopied ? 'success' : ''}
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default Content;
