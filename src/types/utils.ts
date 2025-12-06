import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react";

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

export type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
>;

export type ComponentPropsWithAsProp<E extends ElementType> =
  ComponentProps<E> & {
    asChild?: boolean;
  };

export type BooleanToString<T> = T extends boolean ? "true" | "false" : T;

// NOTE: This was created because its not easy to acccess Tailwind variants type
// Without having to pass all sorts of generics
export type PropsToVariants<T> = {
  [K in keyof T]: Exclude<T[K], undefined> extends boolean
    ? { true: string; false?: string }
    : {
        [V in BooleanToString<Exclude<T[K], undefined>> & string]: string;
      };
};
