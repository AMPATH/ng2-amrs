/**
 * Calls `done` once an element matching `selector` inside `host` is on screen
 * with a height, and the browser has painted it - so a loading skeleton can be
 * removed without a blank moment before the content shows. Gives up after
 * `maxFrames` (about 2 seconds) and calls `done` anyway, so nothing waits
 * forever. Returns a function that cancels the wait.
 */
export function whenPainted(
  host: HTMLElement,
  selector: string,
  done: () => void,
  maxFrames = 120
): () => void {
  let frames = 0;
  let cancelled = false;
  let handle: number;
  const check = () => {
    if (cancelled) {
      return;
    }
    const element = host ? (host.querySelector(selector) as HTMLElement) : null;
    frames++;
    if ((element && element.offsetHeight > 0) || frames >= maxFrames) {
      // One more frame, so the content has been painted before the swap.
      handle = requestAnimationFrame(() => {
        if (!cancelled) {
          done();
        }
      });
      return;
    }
    handle = requestAnimationFrame(check);
  };
  handle = requestAnimationFrame(check);
  return () => {
    cancelled = true;
    cancelAnimationFrame(handle);
  };
}
