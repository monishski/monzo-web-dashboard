type Booleanish = boolean | "true" | "false";

export const isTruthy = (value?: Booleanish): boolean => {
  if (!value) return false;
  if (typeof value === "boolean") return value;
  return value === "true";
};
