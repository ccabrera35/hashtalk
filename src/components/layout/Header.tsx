import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";
import FeedbackForm from "../feedback/FeedbackForm";
import Logo from "../Logo";
import PageHeading from "../PageHeading";

export default function Header() {
  const addItemToList = useFeedbackItemsStore((state) => state.addItemToList);

  return (
    <header>
      <div className="pattern" />
      <a href="/" className="logo">
        <Logo />
        <p className="logo-company-name">HashTalk</p>
      </a>
      <PageHeading />
      <FeedbackForm onAddToList={addItemToList} />
    </header>
  );
}
