import { getObjectKeys } from "./object";

export function getVariantProps<
  VariantKeys extends string[],
  Props extends Record<string, unknown>,
>(
  props: Props,
  variantKeys: VariantKeys
): {
  variantProps: Pick<Props, VariantKeys[number]>;
  componentProps: Omit<Props, VariantKeys[number]>;
} {
  const variantKeysSet = new Set<VariantKeys[number]>(variantKeys);
  const propKeys = getObjectKeys(props);

  return propKeys.reduce(
    (acc, key) => {
      if (variantKeysSet.has(key as VariantKeys[number])) {
        acc.variantProps[key as VariantKeys[number]] = props[
          key as VariantKeys[number]
        ] as Props[VariantKeys[number]];
      } else {
        acc.componentProps[key as keyof Omit<Props, VariantKeys[number]>] =
          props[key as keyof Omit<Props, VariantKeys[number]>];
      }
      return acc;
    },
    {
      variantProps: {} as Pick<Props, VariantKeys[number]>,
      componentProps: {} as Omit<Props, VariantKeys[number]>,
    }
  );
}
