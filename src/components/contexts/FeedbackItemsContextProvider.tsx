import { createContext, useMemo, useState } from "react";
import { TFeedbackItem } from "../../lib/types";
import { useFeedbackItems } from "../../lib/hooks";
type FeedbackItemsContextProps = {
  children: React.ReactNode;
};

type TFeedbackItemsContext = {
  filteredFeedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  companyList: string[];
  handleAddToList: (text: string) => void;
  handleSelectCompany: (company: string) => void;
};

export const FeedbackItemsContext = createContext<TFeedbackItemsContext | null>(
  null
);

export default function FeedbackItemsContextProvider({
  children
}: FeedbackItemsContextProps) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const { feedbackItems, isLoading, errorMessage, setFeedbackItems } =
    useFeedbackItems();

  const companyList = useMemo(
    () =>
      feedbackItems
        .map((item) => item.company)
        .filter((company, index, array) => array.indexOf(company) === index),
    [feedbackItems]
  );

  const filteredFeedbackItems = useMemo(
    () =>
      selectedCompany
        ? feedbackItems.filter(
            (feedbackItem) => feedbackItem.company === selectedCompany
          )
        : feedbackItems,
    [feedbackItems, selectedCompany]
  );

  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };

  const handleAddToList = async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    const newItem: Partial<TFeedbackItem> = {
      text: text,
      upvote_count: 0,
      days_ago: 0,
      company: companyName,
      badge_letter: companyName[0].toUpperCase()
    };

    const res = await fetch(
      "https://fzeqvhaykoiwbtmwwzir.supabase.co/rest/v1/feedback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6ZXF2aGF5a29pd2J0bXd3emlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMzk1NTYsImV4cCI6MjAyMzYxNTU1Nn0.viGz90bxmh9EW-D43lSCLHYgZtZlvGlCkqAbVkFh47o",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.pgrst.object+json",
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },

        body: JSON.stringify(newItem)
      }
    );

    const resData = await res.json();
    setFeedbackItems([...feedbackItems, resData]);

    console.log("testing", resData);
  };

  return (
    <FeedbackItemsContext.Provider
      value={{
        filteredFeedbackItems,
        isLoading,
        errorMessage,
        companyList,
        handleAddToList,
        handleSelectCompany
      }}
    >
      {children}
    </FeedbackItemsContext.Provider>
  );
}
