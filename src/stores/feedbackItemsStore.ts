import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getFilteredFeedbackItems: () => {
    const state = get();
    return state.selectedCompany
      ? state.feedbackItems.filter(
          (feedbackItem) => feedbackItem.company === state.selectedCompany
        )
      : state.feedbackItems;
  },
  addItemToList: async (text: string) => {
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
      "https://ofwqrdlmmjaasyotykfg.supabase.co/rest/v1/feedback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9md3FyZGxtbWphYXN5b3R5a2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNjU1MjQsImV4cCI6MjAyMzY0MTUyNH0.LoGfMN_FwJKgEXwCumaI_k7mN2fHcZ69iJHTswg2VUg",
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

    set((state) => ({
      feedbackItems: [...state.feedbackItems, resData]
    }));
  },
  selectCompany: (company: string) => {
    set(() => ({
      selectedCompany: company
    }));
  },
  fetchFeedbackItems: async () => {
    set(() => ({
      isLoading: true
    }));

    try {
      const res = await fetch(
        "https://ofwqrdlmmjaasyotykfg.supabase.co/rest/v1/feedback?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9md3FyZGxtbWphYXN5b3R5a2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNjU1MjQsImV4cCI6MjAyMzY0MTUyNH0.LoGfMN_FwJKgEXwCumaI_k7mN2fHcZ69iJHTswg2VUg&order=id"
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      set(() => ({
        feedbackItems: data
      }));
    } catch (error) {
      set(() => ({
        errorMessage: `Something went wrong. Please try again later.`
      }));
    }
    set(() => ({
      isLoading: false
    }));
  }
}));
