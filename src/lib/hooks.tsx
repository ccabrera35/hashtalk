import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../components/contexts/FeedbackItemsContextProvider";
import { TFeedbackItem } from "./types";

export function useFeedbackItemsContext() {
  const context = useContext(FeedbackItemsContext);

  if (!context) {
    throw new Error(
      "FeedbackItemsContext is not defined in FeedbackList component"
    );
  }

  return context;
}

export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          "https://fzeqvhaykoiwbtmwwzir.supabase.co/rest/v1/feedback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6ZXF2aGF5a29pd2J0bXd3emlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMzk1NTYsImV4cCI6MjAyMzYxNTU1Nn0.viGz90bxmh9EW-D43lSCLHYgZtZlvGlCkqAbVkFh47o&order=id"
        );

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();

        setFeedbackItems(data);
      } catch (error) {
        setErrorMessage(`Something went wrong. Please try again later.`);
      }
      setIsLoading(false);
    };

    fetchFeedbackItems();
  }, []);

  return {
    feedbackItems,
    isLoading,
    errorMessage,
    setFeedbackItems
  };
}
