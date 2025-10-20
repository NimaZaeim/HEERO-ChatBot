// This component renders a pill bar with clickable pills.
// It allows users to click on pills to trigger an action.

import { Button } from "@/components/ui/button";

type PillBarProps = {
  pills: string[]; // Array of pills to display in the bar coming from n8n response
  onPillClick: (pill: string) => void; // Callback function to handle pill click events
};

const PillBar = ({ pills, onPillClick }: PillBarProps) => {
  if (pills.length === 0) return null;

  return (
    <div
      className="
        flex gap-2 
        overflow-x-auto whitespace-nowrap 
        md:overflow-visible md:flex-wrap 
        no-scrollbar
        -mx-2 px-2
      "
    >
      {pills.map((pill, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-full text-sm bg-[color:var(--secondary-lightblue)] backdrop-blur-md hover:bg-[color:var(--secondary-accent)] text-[color:var(--neutral-dark)] hover:text-white whitespace-nowrap"
          onClick={() => onPillClick(pill)}
        >
          <span className="truncate max-w-[70vw] md:max-w-none" title={pill}>
            {pill}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default PillBar;
