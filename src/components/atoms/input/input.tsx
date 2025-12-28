import type { ComponentProps } from "react";
import React, { useRef } from "react";
import { X } from "lucide-react";

import { getVariantProps } from "@/utils/tailwind-variants";

import { IconButton } from "../button";
import { Row, Stack } from "../flex";
import { Label } from "../label";
import { Text } from "../typography";
import { inputVariants, type InputVariantsProps } from "./input.variants";

const RequiredAterisk = (): React.JSX.Element => (
  <Text
    size="base"
    weight="semibold"
    color="error"
    className="w-min select-none"
  >
    *
  </Text>
);

type InputProps = {
  label: string;
  labelIcon?: React.ReactNode;
  required?: boolean;
  description?: string;
  subdescription?: string;
  error?: string;
  actions?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIconButton?: React.ReactNode;
  onClear?: () => void;
} & ComponentProps<"input"> &
  Omit<InputVariantsProps, "error">;

export function Input({
  className,
  label,
  labelIcon,
  required,
  description,
  subdescription,
  error,
  actions,
  leftIcon,
  rightIconButton,
  onClear,
  ...props
}: InputProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const { variantProps, componentProps: inputProps } = getVariantProps(
    props,
    inputVariants.variantKeys
  );

  const {
    inputGroup,
    inputLabel,
    input,
    inputLeftIcon,
    inputRightIconButtons,
    inputDescription,
  } = inputVariants({
    ...variantProps,
    hasLeftIcon: Boolean(leftIcon),
    hasRightIconButton: Boolean(rightIconButton),
    error: Boolean(error),
    className,
  });

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Stack
      fullWidth
      className={inputGroup()}
      data-disabled={JSON.stringify(variantProps.disabled)}
      data-invalid={JSON.stringify(Boolean(error))}
    >
      <Row align="end" justify="between" fullWidth>
        <Stack gap="none">
          <Label htmlFor={props.id} className={inputLabel()}>
            {labelIcon}
            {label}
            {required && <RequiredAterisk />}
          </Label>
          <Text size="sm" className={inputDescription()}>
            {description}
          </Text>
        </Stack>
        {actions}
      </Row>
      <Row fullWidth className="relative">
        <Row className={inputLeftIcon()}>{leftIcon}</Row>
        <input
          ref={inputRef}
          className={input()}
          disabled={variantProps.disabled}
          {...inputProps}
        />
        <Row gap="xs" className={inputRightIconButtons()}>
          {!!inputProps.value && (
            <IconButton
              variant="ghost"
              size="2xs"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <X />
            </IconButton>
          )}
          {rightIconButton}
        </Row>
      </Row>
      {subdescription && !error && (
        <Text size="sm" color="muted">
          {subdescription}
        </Text>
      )}
      {error && (
        <Text size="xs" color="error">
          {error}
        </Text>
      )}
    </Stack>
  );
}
