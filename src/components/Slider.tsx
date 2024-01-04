import { createSignal, onCleanup, onMount, type Component } from "solid-js";
import { twMerge } from "tailwind-merge";

interface SliderProps {
  progress: number;
  class?: string;
  onInteract?: (progress: number) => void;
}

function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

const Slider: Component<SliderProps> = (props) => {
  const [state, setState] = createSignal({
    progress: 0,
    dragging: false,
  });

  function sendProgress(p: number) {
    if (props.onInteract) {
      props.onInteract(p);
    }
  }

  let el: HTMLDivElement | undefined;

  function mouseUp(e: MouseEvent) {
    if (!state().dragging) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const p = state().progress;
    sendProgress(p);
    setState({ progress: 0, dragging: false });
  }

  function mouseMove(e: MouseEvent) {
    if (!el || !state().dragging) return;

    const p = calculateProgress(e.clientX, el.getBoundingClientRect());

    sendProgress(p);
    setState((prev) => ({ ...prev, progress: p }));
  }

  function touchEnd(e: TouchEvent) {
    if (!state().dragging) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const p = state().progress;

    sendProgress(p);
    setState({ progress: 0, dragging: false });
  }

  function touchMove(e: TouchEvent) {
    if (!el || !state().dragging) return;

    const touch = e.touches[0];
    const p = calculateProgress(touch.clientX, el.getBoundingClientRect());

    sendProgress(p);
    setState((prev) => ({ ...prev, progress: p }));
  }

  function calculateProgress(clientX: number, rect: DOMRect) {
    const x = clientX - rect.x;
    const p = x / rect.width;
    return clamp(p, 0.0, 1.0);
  }

  onMount(() => {
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("touchend", touchEnd);
    document.addEventListener("touchmove", touchMove);

    onCleanup(() => {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("touchend", touchEnd);
      document.removeEventListener("touchmove", touchMove);
    });
  });

  return (
    <div
      ref={el}
      class={twMerge(
        "relative h-2 w-full touch-none select-none bg-blue-300",
        props.class,
      )}
      onMouseDown={(e) => {
        const p = calculateProgress(
          e.clientX,
          e.target.getBoundingClientRect(),
        );

        sendProgress(p);
        setState({
          progress: p,
          dragging: true,
        });
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];

        const p = calculateProgress(
          touch.clientX,
          e.target.getBoundingClientRect(),
        );

        sendProgress(p);
        setState({
          progress: p,
          dragging: true,
        });
      }}
    >
      <div
        style={`width: ${
          clamp(
            state().dragging ? state().progress : props.progress,
            0.0,
            1.0,
          ) * 100
        }%`}
        class="pointer-events-none absolute h-full bg-green-700"
      >
        <div class="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-600"></div>
      </div>
    </div>
  );
};

export default Slider;
