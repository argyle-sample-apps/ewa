import clsx from "clsx";
import { AddSmallIcon } from "./icons";
import { InlineButton } from "components/button";
import { INCOME_FILTER_ALL } from "consts";

type SelectedSource = {
  selectedSource: string;
  setSelectedSource: (source: string) => void;
};

type IncomeSourcePickerProps = {
  sources: any;
  onLinkOpen?: () => void;
} & SelectedSource;

type SourceButtonProps = {
  label: string;
  source: string;
  color?: string;
} & SelectedSource;

function SourceButton({
  source,
  label,
  color,
  selectedSource,
  setSelectedSource,
}: SourceButtonProps) {
  return (
    <InlineButton
      onClick={() => setSelectedSource(source)}
      className={clsx(
        "flex flex-none items-center rounded-full px-3 py-1 !text-sm",
        selectedSource === source
          ? "!bg-gray-100 !text-gray-darkest"
          : "!text-gray"
      )}
    >
      {color && (
        <span
          className="mr-2 block h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="flex-none">{label}</span>
    </InlineButton>
  );
}

export function IncomeSourcePicker({
  sources,
  selectedSource,
  setSelectedSource,
  onLinkOpen,
}: IncomeSourcePickerProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      <SourceButton
        source={INCOME_FILTER_ALL}
        label="All"
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
      {sources.map((source: any) => (
        <SourceButton
          key={source.id}
          label={source.link_item_details.name}
          source={source.link_item}
          color={source.color}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
      ))}
      {onLinkOpen && (
        <InlineButton
          onClick={onLinkOpen}
          className="flex items-center !text-sm !font-medium !text-purple"
        >
          <div className="mr-1">
            <AddSmallIcon />
          </div>
          Add
        </InlineButton>
      )}
    </div>
  );
}
