/**
 * Function to get cursor position in an input field
 */
export function getCursorPosition(el: HTMLInputElement): {
  begin: number;
  end: number;
  result: string;
} {
  const ret: { begin: number; end: number; result: string } = {
    begin: 0,
    end: 0,
    result: "",
  };

  if ("selectionStart" in el && el.selectionStart !== null) {
    ret.begin = el.selectionStart;
    ret.end = el.selectionEnd ?? el.selectionStart;
    ret.result = el.value.substring(ret.begin, ret.end);
  }

  el.focus();
  return ret;
}

/**
 * Function to check if a value is a valid IP segment (0-255)
 */
export function isValidIPSegment(val: number): boolean {
  return Number.isInteger(val) && val >= 0 && val <= 255;
}
