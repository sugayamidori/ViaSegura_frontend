import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@viasegura/components/ui/popover";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Popover Component", () => {
  test("should render the trigger and open content on click", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>
    );

    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    const trigger = screen.getByText("Open Popover");
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByText("Popover Content")).toBeInTheDocument();
  });

  test("should apply custom classNames to the content", async () => {
    const user = userEvent.setup();
    const customClass = "my-custom-class";

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className={customClass}>Content</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText("Open"));

    const content = await screen.findByText("Content");

    expect(content).toHaveClass(customClass);
    expect(content).toHaveClass("bg-popover");
    expect(content).toHaveClass("z-50");
  });

  test("should handle default props correctly (align center, sideOffset 4)", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText("Open"));

    const content = await screen.findByText("Content");

    expect(content).toHaveAttribute("data-align", "center");
  });

  test("should allow overriding align prop", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent align="start">Content</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText("Open"));

    const content = await screen.findByText("Content");
    expect(content).toHaveAttribute("data-align", "start");
  });

  test("should render PopoverAnchor correctly", () => {
    render(
      <Popover open={true}>
        <PopoverAnchor>
          <div data-testid="anchor-element">Anchor</div>
        </PopoverAnchor>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    expect(screen.getByTestId("anchor-element")).toBeInTheDocument();
  });

  test("should close when clicking outside (default behavior)", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>Outside Element</button>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </div>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Content")).toBeInTheDocument();

    await user.click(screen.getByText("Outside Element"));
    await waitFor(() => {
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });
});
