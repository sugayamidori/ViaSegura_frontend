import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@viasegura/components/ui/form";
import { FormWithSubmitProps } from "@viasegura/types/tests";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const FormWithSubmit: React.FC<FormWithSubmitProps> = ({
  rules,
  description,
}) => {
  const methods = useForm({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        <FormField
          name="name"
          rules={rules}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe("Form components", () => {
  test("FormItem renders children correctly", () => {
    render(
      <Wrapper>
        <FormItem>
          <div>Teste</div>
        </FormItem>
      </Wrapper>
    );
    expect(screen.getByText("Teste")).toBeInTheDocument();
  });

  test("FormLabel links correctly to control", () => {
    render(
      <Wrapper>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </Wrapper>
    );
    const label = screen.getByText("Name");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", input.id);
  });

  test("FormDescription appears correctly", () => {
    render(
      <Wrapper>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Digite seu nome completo</FormDescription>
            </FormItem>
          )}
        />
      </Wrapper>
    );
    expect(screen.getByText("Digite seu nome completo")).toBeInTheDocument();
  });

  test("FormMessage renders error message", async () => {
    render(<FormWithSubmit rules={{ required: "Nome é obrigatório" }} />);

    const input = screen.getByRole("textbox", { name: "Nome" });
    const submitButton = screen.getByText("Submit");

    await userEvent.clear(input);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    });
  });

  test("FormControl has correct aria attributes when error is present", async () => {
    render(<FormWithSubmit rules={{ required: "Campo obrigatório" }} />);

    const input = screen.getByRole("textbox", { name: "Nome" });
    const submitButton = screen.getByText("Submit");

    await userEvent.clear(input);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    });

    expect(input).toHaveAttribute("aria-invalid", "true");

    const errorMessage = screen.getByText("Campo obrigatório");

    const describedByIds =
      input.getAttribute("aria-describedby")?.split(" ") || [];
    expect(describedByIds).toContain(errorMessage.id);
  });
});
