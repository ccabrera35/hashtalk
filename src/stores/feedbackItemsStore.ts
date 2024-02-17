import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";
import { supabase } from "..";

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  updateVoteCount: (upvoteCount: number, id: number) => Promise<void>;
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
      created_at: new Date(),
      company: companyName,
      badge_letter: companyName[0].toUpperCase()
    };

    const { data } = await supabase
      .from("feedback")
      .insert(newItem)
      .select()
      .single<TFeedbackItem>();

    if (data) {
      set((state) => ({
        feedbackItems: [data, ...state.feedbackItems]
      }));
    }
  },
  updateVoteCount: async (upvoteCount: number, id: number) => {
    await supabase
      .from("feedback")
      .update({ upvote_count: upvoteCount })
      .eq("id", id);
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
      const { data } = await supabase
        .from("feedback")
        .select()
        .order("created_at", { ascending: false })
        .returns<TFeedbackItem[]>();

      if (data) {
        set(() => ({
          feedbackItems: data
        }));
      }
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
