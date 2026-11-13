export const MIN_REQUEST_LENGTH = 10;
export const MAX_REQUEST_LENGTH = 1000;

export function getRequestStatus(text: string) {
  const length = text.trim().length;
  const isDisabled = length < MIN_REQUEST_LENGTH;

  return {
    isDisabled,
    isTooShort: isDisabled && length > 0,
  };
}
