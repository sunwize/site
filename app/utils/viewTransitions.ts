const VIEW_TRANSITION_NAME_SEPARATOR = "-";

const toViewTransitionNamePart = (part: string) =>
  part
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, VIEW_TRANSITION_NAME_SEPARATOR)
    .replace(/-+/g, VIEW_TRANSITION_NAME_SEPARATOR)
    .replace(/^-|-$/g, "");

export const toViewTransitionName = (
  ...parts: ReadonlyArray<string | number>
) =>
  parts
    .map((part) => toViewTransitionNamePart(String(part)))
    .filter(Boolean)
    .join(VIEW_TRANSITION_NAME_SEPARATOR);
