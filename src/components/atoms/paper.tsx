import { cn } from "@/utils";

type PaperProps = React.ComponentProps<"div">;

export function Paper({
  className,
  ...props
}: PaperProps): React.JSX.Element {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-foreground border-edge rounded-2xl border p-4 shadow-md",
        className
      )}
      {...props}
    />
  );
}
