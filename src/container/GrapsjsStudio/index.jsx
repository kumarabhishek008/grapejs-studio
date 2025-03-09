import React, { useState } from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";

const GrapesJsStudioBuilder = () => {
  const [editor, seteditor] = useState(null);

  function saveToSessionStorage(key, project) {
    sessionStorage.setItem(key, JSON.stringify(project));
  }

  function loadFromSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  function addNewComponentType(editor) {
    const domc = editor.DomComponents;
    const bm = editor.BlockManager;

    domc.addType("my-custom-element", {
      model: {
        defaults: {
          tagName: "button",
          className: "my-custom-element",
          draggable: true,
          droppable: true,
          resizable: true,
          traits: [
            {
              type: "input",
              name: "title",
              label: "title",
              default: "",
            },
            {
              type: "input",
              name: "Id",
              label: "Id",
              default: "",
            },
          ],
        },
      },
      isComponent: (el) => {
        if (el?.classList?.contains("my-custom-element")) {
          // You should explicitly declare the type of your resultant
          // object, otherwise the `default` one will be used
          const result = { type: "my-custom-element" };

          // if (/* some other condition */) {
          //   result.attributes = { title: 'Hi' };
          // }

          return result;
        }
      },
    });

    bm.add("fgjhgfjg", {
      label: "My Custom Element",
      category: "Custom",
      content: `
      <button>Click me</button>
      `,
    });
  }

  return (
    <StudioEditor
      style={{
        width: "100vw",
        height: "100vh",
      }}
      options={{
        // ...
        storage: {
          type: "self",
          // autosaveChanges: 5,
          // // save after every 10 seconds
          // autosaveIntervalMs: 10000,
          onSave: async ({ project }) => {
            await saveToSessionStorage("DEMO_PROJECT_ID", project);
            console.log("Project saved", { project });
          },
          onLoad: async () => {
            const project = await loadFromSessionStorage("DEMO_PROJECT_ID");
            console.log("Project loaded", { project });

            // If the project doesn't exist (eg. first load), let's return a new one.
            return {
              project: project || {
                pages: [{ name: "Home", component: "<h1>New project</h1>" }],
              },
            };
          },
        },
        onEditor: (editor) => {
          seteditor(editor);
          addNewComponentType(editor);
        },
        project: {
          type: "web",
          default: {
            pages: [
              { name: "Home", component: "<h1>Home page</h1>" },
              { name: "About", component: "<h1>About page</h1>" },
              { name: "Contact", component: "<h1>Contact page</h1>" },
            ],
          },
        },
        i18n: {
          locales: {
            en: {
              actions: {
                importCode: {
                  content: "Paste here your MJML code and click Import",
                },
              },
            },
          },
        },
        plugins: [
          // "grapesjs-preset-webpage",
          // "grapesjs-lory-slider",
          // "grapesjs-tabs",
          // "grapesjs-custom-code",
          // "grapesjs-touch",
          // "grapesjs-parser-postcss",
          // "grapesjs-style-gradient",
          // "grapesjs-style-filter",
          // "grapesjs-style-bg",
          // "grapesjs-style-border",
          // "grapesjs-style-text",
          // "grapesjs-style-box",
          // "grapesjs-style-flex",
          // "grapesjs-style-grid",
          // "grapesjs-style-import",
          // "grapesjs-style-manager",
          // "grapesjs-style-align",
          // "grapesjs-style-clear",
          // "grapesjs-style-inherit",
          // "grapesjs-style-shadow",
          // "grapesjs-style-size",
          // "grapesjs-style-spacing",
          // "grapesjs-style-text-shadow",
          // "grapesjs-style-trait",
          // "grapesjs-style-visibility",
          // "grapesjs-style-text-align",
          // "grapesjs-style-text-decoration",
          // "grapesjs-style-text-transform",
        ],
      }}
    />
  );
};

export default GrapesJsStudioBuilder;
