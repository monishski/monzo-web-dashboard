type PolymorphicAsProp<E extends React.ElementType> = {
  as?: E;
};

export type PolymorphicProps<E extends React.ElementType> =
  React.PropsWithChildren<
    React.ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
  >;

export type ComponentPropsWithAsProp<E extends React.ElementType> =
  React.ComponentProps<E> & {
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
