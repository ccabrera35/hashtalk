import { useState } from "react";
import { differenceInDays } from "date-fns";
import { TFeedbackItem } from "../../lib/types";
import { TriangleUpIcon } from "@radix-ui/react-icons";

type FeedbackItemProps = {
  feedbackItem: TFeedbackItem;
  updateVoteOnDB: (update_count: number, id: number) => void;
};

export default function FeedbackItem({
  feedbackItem,
  updateVoteOnDB
}: FeedbackItemProps) {
  const [open, setOpen] = useState(false);
  const { upvote_count, badge_letter, company, text, created_at, id } =
    feedbackItem;
  const [newUpvoteCount, setNewUpvoteCount] = useState(upvote_count);
  const daysAgo = differenceInDays(new Date(), new Date(created_at));

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNewUpvoteCount((prev) => ++prev);
    e.currentTarget.disabled = true;
    e.stopPropagation();

    const newCount = upvote_count + 1;
    updateVoteOnDB(newCount, id);
  };

  return (
    <li
      onClick={() => setOpen((prev) => !prev)}
      className={`feedback ${open ? "feedback--expand" : ""}`}
    >
      <button onClick={handleUpvote}>
        <TriangleUpIcon />
        <span>{newUpvoteCount}</span>
      </button>
      <div>
        <p>{badge_letter}</p>
      </div>
      <div>
        <p>{company}</p>
        <p>{text}</p>
      </div>
      <p>{daysAgo === 0 ? `NEW` : `${daysAgo}d`}</p>
    </li>
  );
}
