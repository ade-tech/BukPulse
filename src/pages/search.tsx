import AccountsCard, {
  AccountsCardSkeleton,
} from "@/components/ui/accountCard";
import { EventAdminCard, EventsCardSkeleton } from "@/components/ui/eventCard";
import GeneralInput from "@/components/ui/generalInput";
import MiniButton from "@/components/ui/miniButton";
import PostCard, { PostCardSkeleton } from "@/components/ui/postCard";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useDebounce, useSearch } from "@/hooks/useSearch";
import { Stack, Icon, HStack, Tabs, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi2";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack align="center" justify="center" py={12} gap={2}>
      <Text fontWeight="bold">{title}</Text>
      {subtitle && (
        <Text color="gray.500" fontSize="sm" textAlign="center">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}

interface SearchInput {
  keyword: string;
}

export default function Search() {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm<SearchInput>({
    defaultValues: { keyword: "" },
  });

  const query = watch("keyword");
  const debouncedQuery = useDebounce(query, 300);
  const { currentUser } = useCurrentUser();

  const { data: results, isLoading } = useSearch(debouncedQuery);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setValue("keyword", q);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery]);

  return (
    <Stack
      w="full"
      h="full"
      pt={2}
      rounded="md"
      overflow="hidden"
      pos="relative"
    >
      <HStack w="full" mt={4} px={4}>
        <MiniButton ml={0}>
          <Icon as={HiArrowLeft} />
        </MiniButton>
        <GeneralInput<SearchInput>
          name="keyword"
          errors={errors}
          register={register}
          placeholder="Enter Search Keyword"
        />
      </HStack>

      <Stack flex={1} minH={0}>
        <Tabs.Root defaultValue="top" fitted h="full" colorPalette="blue">
          <Tabs.List bg="bg.page">
            <Tabs.Trigger value="top">Top</Tabs.Trigger>
            <Tabs.Trigger value="news">News</Tabs.Trigger>
            <Tabs.Trigger value="admins">Moderators</Tabs.Trigger>
            <Tabs.Trigger value="events">Events</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="top"
            px={5}
            h="full"
            overflowY="auto"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
            className="no-scrollbar"
            pb={16}
          >
            {!isLoading && (results?.accounts?.length ?? 0) >= 1 && (
              <Text fontWeight="bold">Moderators</Text>
            )}

            <HStack overflowX="auto" py={2} className="no-scrollbar">
              {isLoading ? (
                <AccountsCardSkeleton isLast />
              ) : (
                results?.accounts?.map((cur) => (
                  <AccountsCard
                    key={cur.id}
                    searchResult
                    data={cur}
                    id={currentUser?.id!}
                  />
                ))
              )}
            </HStack>

            {/** Empty state when no moderators and no posts */}
            {!isLoading &&
              (results == null ||
                ((results?.accounts?.length ?? 0) === 0 &&
                  (results?.posts?.length ?? 0) === 0)) && (
                <EmptyState
                  title="No results found"
                  subtitle={`No moderators or posts found for "${debouncedQuery}"`}
                />
              )}

            <Stack>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))
                : results?.posts.map((cur) => (
                    <PostCard key={cur.id} data={cur} />
                  ))}
            </Stack>
          </Tabs.Content>

          <Tabs.Content
            value="news"
            px={5}
            h="full"
            overflowY="auto"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
            className="no-scrollbar"
            pb={16}
          >
            {isLoading ? (
              <Stack>
                {Array.from({ length: 4 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </Stack>
            ) : (results?.posts?.length ?? 0) === 0 ? (
              <EmptyState
                title="No posts"
                subtitle={`No posts found for "${debouncedQuery}"`}
              />
            ) : (
              <Stack>
                {results?.posts.map((cur) => (
                  <PostCard key={cur.id} data={cur} />
                ))}
              </Stack>
            )}
          </Tabs.Content>

          <Tabs.Content
            value="admins"
            px={5}
            h="full"
            overflowY="auto"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
            className="no-scrollbar"
            pb={16}
          >
            {isLoading ? (
              <AccountsCardSkeleton isLast />
            ) : (results?.accounts?.length ?? 0) === 0 ? (
              <EmptyState
                title="No moderators"
                subtitle={`No moderators found for "${debouncedQuery}"`}
              />
            ) : (
              <Stack>
                {results?.accounts?.map((cur) => (
                  <AccountsCard key={cur.id} data={cur} id={currentUser?.id!} />
                ))}
              </Stack>
            )}
          </Tabs.Content>

          <Tabs.Content
            value="events"
            px={5}
            h="full"
            overflowY="auto"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
            className="no-scrollbar"
            pb={16}
          >
            {isLoading ? (
              <EventsCardSkeleton />
            ) : (results?.events?.length ?? 0) === 0 ? (
              <EmptyState
                title="No events"
                subtitle={`No events found for "${debouncedQuery}"`}
              />
            ) : (
              results?.events?.map((cur) => (
                <EventAdminCard key={cur.id} data={cur} />
              ))
            )}
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Stack>
  );
}
