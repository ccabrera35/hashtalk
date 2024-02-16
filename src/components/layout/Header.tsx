import { useFeedbackItemsContext } from "../../lib/hooks";
import FeedbackForm from "../feedback/FeedbackForm";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";

export default function Header() {
  const { handleAddToList } = useFeedbackItemsContext();
  return (
    <header>
      <Pattern />
      <a href="/" className="logo">
        <Logo />
        <p className="logo-company-name">HashTalk</p>
      </a>
      <PageHeading />
      <FeedbackForm onAddToList={handleAddToList} />
    </header>
  );
}
