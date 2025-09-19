import { tv } from "tailwind-variants";

export const paperTv = tv({
  base: "bg-foreground border-edge rounded-2xl border p-4 shadow-md",
});

type PaperProps = React.ComponentProps<"div">;

export function Paper({
  className,
  ...props
}: PaperProps): React.JSX.Element {
  return (
    <div data-slot="card" className={paperTv({ className })} {...props} />
  );
}
