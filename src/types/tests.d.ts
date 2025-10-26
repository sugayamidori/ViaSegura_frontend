export interface CustomInputProps {
  type?: string;
  className?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export interface FormWithSubmitProps {
  rules?: RegisterOptions;
  description?: string;
}
