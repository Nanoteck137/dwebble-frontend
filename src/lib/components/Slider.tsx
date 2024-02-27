import noUiSlider, { API } from "nouislider";
import "nouislider/dist/nouislider.css";
import { Component, createEffect, onCleanup, onMount } from "solid-js";

type SliderProps = {
  initialValue: number;
  value?: number;
  onUpdate: (value: number) => void;
};

const Slider: Component<SliderProps> = (props) => {
  let api: API | undefined;
  let dragging = false;
  const sliderRef = (element: HTMLElement | null) => {
    if (element) {
      onMount(() => {
        api = noUiSlider.create(element, {
          start: props.initialValue * 100,
          range: {
            min: 0,
            max: 100,
          },
          behaviour: "snap",
        });

        api.on("change", (values) => {
          if (typeof values[0] === "string") {
            props.onUpdate(parseFloat(values[0]) / 100);
          }
        });

        api.on("start", () => {
          dragging = true;
        });

        api.on("end", () => {
          dragging = false;
        });

        onCleanup(() => {
          api?.destroy();
        });
      });
    }
  };

  createEffect(() => {
    if (props.value && api && !dragging) api.setHandle(0, props.value * 100);
  });

  return (
    <div class="slider group absolute left-0 right-0">
      <div id="dual-knob-slider" ref={sliderRef}></div>
    </div>
  );
};

export default Slider;
