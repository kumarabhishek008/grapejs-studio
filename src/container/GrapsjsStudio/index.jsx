import React, { useState } from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";

const GrapesJsStudioBuilder = () => {
  const [editor, seteditor] = useState(null);
  const [pages, setPages] = useState([
    { name: "Home", component: "<h1>Home page</h1>", settings: {} },
    { name: "About", component: "<h1>About page</h1>" },
    { name: "Contact", component: "<h1>Contact page</h1>" },
  ]);

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
          // stylable: ["width", "height", "display", "color"],
          // unstylable: ["color"],
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
      <button class="my-custom-element">Click me</button>
      `,
    });
  }

  function addStyles(editor) {
    editor.StyleManager.sectors.add({
      id: "new_sector",
      name: "New",
      properties: [
        {
          type: "composite",
          property: "border-radius",
          label: "border-radius",
          // Additional props
          properties: [
            {
              type: "number",
              units: ["px"],
              default: "0",
              property: "border-top-left-radius",
            },
            {
              type: "number",
              units: ["px"],
              default: "0",
              property: "border-top-right-radius",
            },
            {
              type: "number",
              units: ["px"],
              default: "0",
              property: "border-bottom-left-radius",
            },
            {
              type: "number",
              units: ["px"],
              default: "0",
              property: "border-bottom-right-radius",
            },
          ],
        },
      ],
    });

    editor.on("style:property:update", (m) => {
      console.log(m, "dfdvfdvd");
    });
  }
  function addNewPage(editor) {
    console.log("add new page");
    editor.Pages.add({
      id: Date.now(),
      name: "dvdfvdfv",
      component: "<h1>New page</h1>",
    });
  }

  function removePage() {
    console.log("remove page");
  }

  function duplicatePage() {
    console.log("duplicate page");
  }

  return (
    <>
      <div id="pages" style={{ position: "absolute", top: 0, left: 0 }} />
      <StudioEditor
        style={{
          width: "100vw",
          height: "100vh",
        }}
        options={{
          pages: {
            add: (page) => {
              console.log("add page", page);
              addNewPage(page.editor);
            },
            remove: ({ editor, page }) => {
              console.log("remove page", page);
              editor.Pages.remove(page);
            },
            duplicate: ({ editor, page }) => {
              console.log("duplicate page", page);
              editor.Pages.add({ ...page, id: Date.now() }, { select: true });
            },
            commandItems: ({ items }) => {
              console.log("command items", items);
              return [
                ...items,
                {
                  id: "new-item",
                  label: "New Item",
                  cmd: () => {
                    console.log("new item");
                  },
                },
              ];
            },
            // settings: false,
          },
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
            addStyles(editor);
            window.editor = editor;
            editor.Pages.__appendTo({ el: "#pages" });
            editor.runCommand("studio:layoutToggle", {
              id: "gs",
              layout: "panelGlobalStyles",
              header: { label: "Global Styles" },
              placer: { type: "absolute", position: "right" },
            });
          },
          project: {
            type: "web",
            default: {
              pages: [...pages],
              custom: {
                projectName: "My Project",
                globalPageSettings: {
                  title: "Global title",
                  description: "Global description",
                  customCodeHead: `
              <meta name="meta-global" content="Global meta"/>
              <link href="https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css" rel="stylesheet">
              <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
              <script>console.log('[GLOBAL]: Custom HTML head');</script>
              <style>.title { font-size: 5rem; }</style>
            `,
                  customCodeBody: "<div>Global Custom HTML body</div>",
                },
              },
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
          globalStyles: {
            default: [
              {
                id: "buttonColor",
                property: "color",
                field: "color",
                defaultValue: "red",
                selector: "button",
                label: "button color",
              },
              {
                id: "buttonsize",
                property: "font-size",
                field: {
                  type: "number",
                  min: 0.1,
                  max: 10,
                  step: 0.1,
                  units: ["rem"],
                },
                defaultValue: "2rem",
                selector: "button",
                label: "size",
              },
            ],
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
    </>
  );
};

export default GrapesJsStudioBuilder;
