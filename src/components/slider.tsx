import ReactSlider from "react-slider";
import { PlatformIcon } from "./platform-icon";
import { formatCurrency } from "utils/index";

type SliderProps = {
  min?: number;
  max: number;
  value: number;
  setCurrentValue: (value: number) => void;
  src?: string;
};

export const Slider = ({
  min = 0,
  max,
  setCurrentValue,
  value,
  src,
}: SliderProps) => {
  return (
    <div className="overflow-visible">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        min={min}
        max={max}
        onChange={(value) => setCurrentValue(value)}
        value={value as any}
        renderThumb={(props, state) => (
          <div {...props}>
            <PlatformIcon src={src} border />
            <div className="value-now">{formatCurrency(state.valueNow)}</div>
          </div>
        )}
      />
    </div>
  );
};
