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
