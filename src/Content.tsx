import { Button, Tooltip } from "@mantine/core";
import { useClipboard, useTextSelection } from "@mantine/hooks";
import { useRef } from "react";

const Content = () => {
  // gets us the selected text
  const selection = useTextSelection();

  const clipboard = useClipboard({ timeout: 500 });

  const textAreaRef = useRef<HTMLDivElement>(null);

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

  function handleClick() {
    console.log(selection?.toString());
  }

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
              onClick={() => handleClick()}
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
                onClick={() => handleClick()}
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
                onClick={() => handleClick()}
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

        <Button
          color={clipboard.copied ? "teal" : "blue"}
          onClick={() => clipboard.copy("")}
        >
          {clipboard.copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

export default Content;
