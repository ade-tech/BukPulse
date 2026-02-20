import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/home";

// Mock the API hooks
vi.mock("@/hooks/useNews", () => ({
  useFetchNewsForFeed: () => ({
    posts: [],
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
    addNewPostsToFeed: vi.fn(),
    latestPostDate: null,
  }),
  useNewPosts: () => ({
    newPostsCount: 0,
    resetCount: vi.fn(),
  }),
}));

vi.mock("@/hooks/useEvent", () => ({
  useFetchLatestEvents: () => ({
    latestEvents: [],
    isLoadingLatestEvents: false,
  }),
}));

describe("Home Page", () => {
  it("should render home page", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
