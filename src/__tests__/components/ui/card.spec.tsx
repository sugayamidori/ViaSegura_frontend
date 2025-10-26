import React from "react";
import { render, screen, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@viasegura/components/ui/card";
configure({ testIdAttribute: "data-slot" });

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Card Components", () => {
  const checkClasses = (
    element: HTMLElement,
    baseClasses: string[],
    customClassName = ""
  ) => {
    baseClasses.forEach((cls) => {
      expect(element.getAttribute("class")).toContain(cls);
    });
    if (customClassName) {
      expect(element).toHaveClass(customClassName);
    }
  };

  describe("Card", () => {
    const baseClasses = [
      "bg-card",
      "text-card-foreground",
      "flex",
      "flex-col",
      "gap-6",
      "rounded-xl",
      "border",
      "py-6",
      "shadow-sm",
    ];

    test("renders a div with base classes and children", () => {
      render(<Card>Card Content</Card>);
      const cardElement = screen.getByTestId("card");
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveTextContent("Card Content");
      checkClasses(cardElement, baseClasses);
    });

    test("merges custom className", () => {
      render(<Card className="custom-card-class">Card Content</Card>);
      const cardElement = screen.getByTestId("card");
      checkClasses(cardElement, baseClasses, "custom-card-class");
    });

    test("passes down other props", () => {
      render(
        <Card id="my-card" data-extra="value">
          Card Content
        </Card>
      );
      const cardElement = screen.getByTestId("card");
      expect(cardElement).toHaveAttribute("id", "my-card");
      expect(cardElement).toHaveAttribute("data-extra", "value");
    });
  });

  describe("CardHeader", () => {
    const baseClasses = [
      "@container/card-header",
      "grid",
      "auto-rows-min",
      "grid-rows-[auto_auto]",
      "items-start",
      "gap-1.5",
      "px-6",
      "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
      "[.border-b]:pb-6",
    ];

    test("renders a div with base classes and children", () => {
      render(<CardHeader>Header Content</CardHeader>);
      const headerElement = screen.getByTestId("card-header");
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveTextContent("Header Content");
      checkClasses(headerElement, baseClasses);
    });

    test("merges custom className", () => {
      render(
        <CardHeader className="custom-header-class">Header Content</CardHeader>
      );
      const headerElement = screen.getByTestId("card-header");
      checkClasses(headerElement, baseClasses, "custom-header-class");
    });

    test("passes down other props", () => {
      render(<CardHeader id="my-header">Header Content</CardHeader>);
      const headerElement = screen.getByTestId("card-header");
      expect(headerElement).toHaveAttribute("id", "my-header");
    });
  });

  describe("CardTitle", () => {
    const baseClasses = ["leading-none", "font-semibold"];

    test("renders a div with base classes and children", () => {
      render(<CardTitle>Card Title</CardTitle>);
      const titleElement = screen.getByTestId("card-title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent("Card Title");
      checkClasses(titleElement, baseClasses);
    });

    test("merges custom className", () => {
      render(<CardTitle className="custom-title-class">Card Title</CardTitle>);
      const titleElement = screen.getByTestId("card-title");
      checkClasses(titleElement, baseClasses, "custom-title-class");
    });

    test("passes down other props", () => {
      render(<CardTitle id="my-title">Card Title</CardTitle>);
      const titleElement = screen.getByTestId("card-title");
      expect(titleElement).toHaveAttribute("id", "my-title");
    });
  });

  describe("CardDescription", () => {
    const baseClasses = ["text-muted-foreground", "text-sm"];

    test("renders a div with base classes and children", () => {
      render(<CardDescription>Card Description</CardDescription>);
      const descriptionElement = screen.getByTestId("card-description");
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveTextContent("Card Description");
      checkClasses(descriptionElement, baseClasses);
    });

    test("merges custom className", () => {
      render(
        <CardDescription className="custom-desc-class">
          Card Description
        </CardDescription>
      );
      const descriptionElement = screen.getByTestId("card-description");
      checkClasses(descriptionElement, baseClasses, "custom-desc-class");
    });

    test("passes down other props", () => {
      render(
        <CardDescription id="my-description">Card Description</CardDescription>
      );
      const descriptionElement = screen.getByTestId("card-description");
      expect(descriptionElement).toHaveAttribute("id", "my-description");
    });
  });

  describe("CardAction", () => {
    const baseClasses = [
      "col-start-2",
      "row-span-2",
      "row-start-1",
      "self-start",
      "justify-self-end",
    ];

    test("renders a div with base classes and children", () => {
      render(<CardAction>Card Action</CardAction>);
      const actionElement = screen.getByTestId("card-action");
      expect(actionElement).toBeInTheDocument();
      expect(actionElement).toHaveTextContent("Card Action");
      checkClasses(actionElement, baseClasses);
    });

    test("merges custom className", () => {
      render(
        <CardAction className="custom-action-class">Card Action</CardAction>
      );
      const actionElement = screen.getByTestId("card-action");
      checkClasses(actionElement, baseClasses, "custom-action-class");
    });

    test("passes down other props", () => {
      render(<CardAction id="my-action">Card Action</CardAction>);
      const actionElement = screen.getByTestId("card-action");
      expect(actionElement).toHaveAttribute("id", "my-action");
    });
  });

  describe("CardContent", () => {
    const baseClasses = ["px-6"];

    test("renders a div with base classes and children", () => {
      render(<CardContent>Card Content Area</CardContent>);
      const contentElement = screen.getByTestId("card-content");
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent("Card Content Area");
      checkClasses(contentElement, baseClasses);
    });

    test("merges custom className", () => {
      render(
        <CardContent className="custom-content-class">
          Card Content Area
        </CardContent>
      );
      const contentElement = screen.getByTestId("card-content");
      checkClasses(contentElement, baseClasses, "custom-content-class");
    });

    test("passes down other props", () => {
      render(<CardContent id="my-content">Card Content Area</CardContent>);
      const contentElement = screen.getByTestId("card-content");
      expect(contentElement).toHaveAttribute("id", "my-content");
    });
  });

  describe("CardFooter", () => {
    const baseClasses = ["flex", "items-center", "px-6", "[.border-t]:pt-6"];

    test("renders a div with base classes and children", () => {
      render(<CardFooter>Card Footer</CardFooter>);
      const footerElement = screen.getByTestId("card-footer");
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveTextContent("Card Footer");
      checkClasses(footerElement, baseClasses);
    });

    test("merges custom className", () => {
      render(
        <CardFooter className="custom-footer-class">Card Footer</CardFooter>
      );
      const footerElement = screen.getByTestId("card-footer");
      checkClasses(footerElement, baseClasses, "custom-footer-class");
    });

    test("passes down other props", () => {
      render(<CardFooter id="my-footer">Card Footer</CardFooter>);
      const footerElement = screen.getByTestId("card-footer");
      expect(footerElement).toHaveAttribute("id", "my-footer");
    });
  });
});
