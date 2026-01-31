import type { Post, Event, Profile } from "@/lib/types";
import { supabase } from "./supabase";

export interface SearchResults {
  posts: Post[];
  events: Event[];
  accounts: Profile[];
}

export const searchContent = async (
  query: string,
  userRole: string = "user",
): Promise<SearchResults> => {
  if (!query || query.trim().length < 2) {
    return {
      posts: [],
      events: [],
      accounts: [],
    };
  }

  const { data, error } = await supabase.rpc("search_content", {
    search_query: query.trim(),
    user_role: userRole,
  });

  if (error) {
    console.error("Search error:", error);
    throw error;
  }

  return data as SearchResults;
};
