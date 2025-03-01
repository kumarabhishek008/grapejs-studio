import React from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";

const GrapesJsStudioBuilder = () => {
  return (
    <StudioEditor
      style={{
        width: "100vw",
        height: "100vh",
      }}
      options={{
        // ...
        project: {
          type: "email",
          default: {
            pages: [
              {
                component:
                  "<mjml><mj-body><mj-section><mj-column><mj-text>My email</mj-text></mj-column></mj-section></mj-body></mjml>",
              },
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
      }}
    />
  );
};

export default GrapesJsStudioBuilder;
