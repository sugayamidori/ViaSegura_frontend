import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Loader } from "@viasegura/components/loader";

jest.mock("lucide-react", () => ({
  Loader2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="loader-icon" {...props} />
  ),
}));

jest.mock("@viasegura/lib/utils", () => ({
  cn: (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Loader", () => {
  test("should render the Loader2 icon", () => {
    render(<Loader />);

    const loaderIcon = screen.getByTestId("loader-icon");
    expect(loaderIcon).toBeInTheDocument();
  });

  test("should apply base classes to the icon", () => {
    render(<Loader />);

    const loaderIcon = screen.getByTestId("loader-icon");

    expect(loaderIcon).toHaveClass("h-16");
    expect(loaderIcon).toHaveClass("w-16");
    expect(loaderIcon).toHaveClass("animate-spin");
  });

  test("should apply custom classes passed via className prop and merge them", () => {
    const customClassName = "text-blue-500";
    render(<Loader className={customClassName} />);

    const loaderIcon = screen.getByTestId("loader-icon");

    expect(loaderIcon).toHaveClass("h-16");
    expect(loaderIcon).toHaveClass("w-16");
    expect(loaderIcon).toHaveClass("animate-spin");
    expect(loaderIcon).toHaveClass(customClassName);
  });

  test("should handle empty or undefined className prop", () => {
    const { rerender } = render(<Loader />);
    let loaderIcon = screen.getByTestId("loader-icon");
    expect(loaderIcon).toHaveClass("h-16");
    expect(loaderIcon).toHaveClass("w-16");
    expect(loaderIcon).toHaveClass("animate-spin");
    expect(loaderIcon).not.toHaveClass("undefined");

    rerender(<Loader className={undefined} />);
    loaderIcon = screen.getByTestId("loader-icon");
    expect(loaderIcon).toHaveClass("h-16");
    expect(loaderIcon).toHaveClass("w-16");
    expect(loaderIcon).toHaveClass("animate-spin");
    expect(loaderIcon).not.toHaveClass("undefined");

    rerender(<Loader className="" />);
    loaderIcon = screen.getByTestId("loader-icon");
    expect(loaderIcon).toHaveClass("h-16");
    expect(loaderIcon).toHaveClass("w-16");
    expect(loaderIcon).toHaveClass("animate-spin");
    expect(loaderIcon).not.toHaveClass("undefined");
  });
});
