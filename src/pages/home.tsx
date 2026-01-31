import NewPostButton from "@/components/ui/newPostButton";
import PostCard, { PostCardSkeleton } from "@/components/ui/postCard";
import { useFetchNewsForFeed, useNewPosts } from "@/hooks/useNews";
import { useFetchLatestEvents } from "@/hooks/useEvent";
import { EventAdminCard, EventsCardSkeleton } from "@/components/ui/eventCard";
import { Box, HStack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function Home() {
  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    addNewPostsToFeed,
    latestPostDate,
  } = useFetchNewsForFeed();

  const { newPostsCount, resetCount } = useNewPosts({
    latestPostDate,
    enabled: true,
  });

  const { latestEvents, isLoadingLatestEvents } = useFetchLatestEvents();

  const observerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNewPostsClick = async () => {
    if (!latestPostDate) return;

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);

    await addNewPostsToFeed(latestPostDate);

    resetCount();
  };
  return (
    <Box
      w={"full"}
      h={"full"}
      pt={2}
      px={4}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      pos={"relative"}
      className="no-scrollbar"
    >
      <Box ref={topRef} h={2} />
      {newPostsCount > 0 && <NewPostButton to={handleNewPostsClick} />}

      {(isLoading || isError) &&
        Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}

      {posts &&
        posts.map((curPost, index) => (
          <Box key={curPost.id}>
            {index === 10 && (
              <Box mb={6}>
                <Text fontWeight="bold" mb={3} fontSize="lg">
                  Latest Events
                </Text>
                <HStack
                  overflowX="auto"
                  pb={4}
                  className="no-scrollbar"
                  gap={3}
                >
                  {isLoadingLatestEvents
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <Box
                          key={i}
                          minW="280px"
                          h="300px"
                          bg="bg.surface"
                          rounded="lg"
                        >
                          <EventsCardSkeleton />
                        </Box>
                      ))
                    : latestEvents && latestEvents.length > 0
                      ? latestEvents.slice(0, 6).map((event) => (
                          <Box key={event.id} minW="280px" flexShrink={0}>
                            <EventAdminCard data={event} />
                          </Box>
                        ))
                      : null}
                </HStack>
              </Box>
            )}
            <PostCard data={curPost} />
          </Box>
        ))}

      <Box ref={observerRef} h={10} />

      {isFetchingNextPage && <PostCardSkeleton />}

      {!hasNextPage && posts.length > 0 && (
        <Box textAlign="center" pb={24} color="gray.500">
          You've reached the end! 🎉
        </Box>
      )}
    </Box>
  );
}
