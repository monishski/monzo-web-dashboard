import React from "react";
import type { Preview } from "@storybook/nextjs-vite";

import "@/styles/globals.css";

import { DocsContainer } from "@storybook/addon-docs/blocks";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Renderer } from "storybook/internal/types";
import { themes } from "storybook/theming";

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<Renderer>({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "dark",
      attributeName: "data-theme",
      parentSelector: "html",
    }),
  ],
  // REF: https://github.com/storybookjs/storybook/discussions/28495#discussioncomment-11184489
  parameters: {
    docs: {
      canvas: {
        className: "!bg-background !text-font",
      },
      container: ({ children, context, ...props }) => {
        const el = document.querySelector("html");
        const theme =
          context.store.userGlobals.globals.theme === "dark"
            ? themes.dark
            : themes.light;
        el!.dataset["theme"] = context.store.userGlobals.globals.theme;
        const newProps = { ...props, theme };
        // REF: https://storybook.js.org/docs/writing-docs/autodocs#customize-the-docs-container
        return (
          <DocsContainer context={context} {...newProps}>
            {children}
          </DocsContainer>
        );
      },
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
