import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from "@viasegura/components/ui/dropdown-menu";

jest.mock("lucide-react", () => ({
  CheckIcon: () => <span data-testid="icon-check" />,
  ChevronRightIcon: () => <span data-testid="icon-chevron-right" />,
  CircleIcon: () => <span data-testid="icon-circle" />,
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn();

describe("DropdownMenu Component", () => {
  beforeAll(() => {
    window.ResizeObserver = ResizeObserver;
  });

  test("should render trigger and open content on click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Open Menu");
    expect(trigger).toBeInTheDocument();

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    await user.click(trigger);

    const item = await screen.findByText("Item 1");
    expect(item).toBeInTheDocument();
    expect(screen.getByRole("menu")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-content"
    );
  });

  test("should execute onClick when an item is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Action Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Action Item"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("should render CheckboxItem with check icon when checked", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Checked Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={false}>
            Unchecked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    const checkedItem = screen.getByText("Checked Item");
    const uncheckedItem = screen.getByText("Unchecked Item");

    expect(checkedItem).toBeInTheDocument();
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    expect(uncheckedItem).toBeInTheDocument();
  });

  test("should render RadioGroup and RadioItems correctly", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="opt2">
            <DropdownMenuRadioItem value="opt1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="opt2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByTestId("icon-circle")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("should render SubMenu components correctly", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    const subTrigger = screen.getByText("More Options");
    expect(subTrigger).toBeInTheDocument();
    expect(screen.getByTestId("icon-chevron-right")).toBeInTheDocument();
  });

  test("should apply custom classNames via cn()", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-red-500">
          <DropdownMenuItem className="text-blue-500">Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    const content = screen.getByRole("menu");
    const item = screen.getByRole("menuitem");

    expect(content).toHaveClass("bg-red-500");
    expect(item).toHaveClass("text-blue-500");
  });

  test("should render labels, separators and shortcuts", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Label</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByText("My Label")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByText("⌘P")).toHaveClass("text-muted-foreground");
  });

  test("should apply inset styling correctly", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));

    const item = screen.getByText("Inset Item");

    expect(item).toHaveAttribute("data-inset", "true");
    expect(item).toHaveClass("data-[inset]:pl-8");
  });
});
