import AppDrawer from "@/components/ui/AppDrawer";
import MiniButton from "@/components/ui/miniButton";
import NewPostButton from "@/components/ui/newPostButton";
import PostCard, { PostCardSkeleton } from "@/components/ui/postCard";
import { toaster } from "@/components/ui/toaster";
import { useCurrentUser } from "@/contexts/AuthContext";
import useGetImageURL from "@/hooks/useGetImageURL";
import {
  useCreateNews,
  useFetchNewsForFeed,
  useNewPosts,
} from "@/hooks/useNews";
import { useNotifyFollowers } from "@/hooks/usePushNotifications";
import { playSound, sounds } from "@/lib/Sounds";
import type { CreateNewsInput } from "@/lib/types";
import {
  Heading,
  Stack,
  Box,
  IconButton,
  Icon,
  Image,
  Input,
  Field,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import { LuUpload } from "react-icons/lu";

/**
 * Renders the News feed UI including post list, infinite-scroll loading, new-post indicator, and an admin-only create-post drawer.
 *
 * The component displays loading skeletons, an empty-state message, and PostCard entries for fetched posts. It exposes a scroll sentinel to load additional pages, a button to reveal newly available posts, and—when the current user is an admin—a bottom drawer that allows creating a new post with a caption and an optional image (JPEG/PNG up to 5 MB). Creating a post triggers the post-creation flow, follower notifications, and success/error toasts.
 *
 * @returns The rendered News feed JSX element.
 */
export default function News() {
  const { currentUser, isAdmin } = useCurrentUser();

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    addNewPostsToFeed,
    latestPostDate,
  } = useFetchNewsForFeed("news", currentUser?.id);

  const { newPostsCount, resetCount } = useNewPosts({
    latestPostDate,
    enabled: false,
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    register,
    formState: { errors },
    watch,
  } = useForm<CreateNewsInput>();

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { notifyFollowers } = useNotifyFollowers();

  const watchedImage = watch("post_image");
  const { imagePreview } = useGetImageURL(watchedImage);
  const hasImage = imagePreview !== null;
  const { createNews, isCreatingNews } = useCreateNews();

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
    <Stack
      w={"full"}
      h={"full"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      overflowY={"auto"}
      className="no-scrollbar"
      pos={"relative"}
    >
      <Box ref={topRef} h={2} />

      {newPostsCount > 0 && <NewPostButton to={handleNewPostsClick} />}

      <Heading
        textStyle={"2xl"}
        ml={2}
        lineHeight={1}
        fontWeight={"bold"}
        px={4}
      >
        News
      </Heading>

      <Box
        w={"full"}
        flex={1}
        overflow={"hidden"}
        pb={24}
        className="no-scrollbar"
        overflowY={"auto"}
        px={4}
      >
        {(isLoading || isError) &&
          Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}

        {posts.length === 0 && !isLoading && (
          <Box textAlign="center" py={12} color="gray.500">
            <p>No posts from people you follow yet</p>
            <p className="text-sm mt-2">
              Follow some users to see their posts here!
            </p>
          </Box>
        )}

        {posts && posts.map((cur) => <PostCard key={cur.id} data={cur} />)}

        <Box ref={observerRef} h={10} />

        {isFetchingNextPage && <PostCardSkeleton />}

        {!hasNextPage && posts.length > 0 && (
          <Box textAlign="center" pb={24} color="gray.500">
            You've reached the end! 🎉
          </Box>
        )}

        {isAdmin && (
          <AppDrawer
            drawerTitle="Create New Post"
            placement="bottom"
            trigger={
              <IconButton
                rounded={"full"}
                size={"xl"}
                pos={"fixed"}
                bottom={"28"}
                right={6}
                boxShadow={"2xl"}
                bg={"accent.primary"}
              >
                <HiPlus />
              </IconButton>
            }
            drawerContent={(store) => {
              const submitFn: SubmitHandler<CreateNewsInput> = ({
                post_image,
                post_caption,
              }) => {
                if (!currentUser?.id) {
                  toaster.error({
                    title: "Authentication Error",
                  });
                  return;
                }

                createNews(
                  { post_caption, post_image, poster_id: currentUser.id },
                  {
                    onSuccess: (data) => {
                      playSound(sounds.success);
                      notifyFollowers(
                        {
                          actorId: currentUser.id,
                          title: `${data?.profiles?.name || "Someone"} posted an update!`,
                          body: post_caption || "Check out this new post!",
                          url: `/news/${data?.id}`,
                          tag: "news_post",
                        },
                        {
                          onError: () => {
                            toaster.error({
                              title: "Notification sending Error",
                            });
                          },
                        },
                      );

                      store.setOpen(false);
                      reset();
                      toaster.success({
                        title: "Posted Successfully ✅",
                      });
                    },
                    onError: () => {
                      toaster.error({
                        title: "We could not make that happen!",
                      });
                    },
                  },
                );
              };
              return (
                <form className="mt-6! mb-6! flex flex-col gap-3">
                  <Field.Root w={"full"} invalid={!!errors.post_caption}>
                    <Textarea
                      {...register("post_caption")}
                      rounded={"lg"}
                      size={"xl"}
                      color={"text.primary"}
                      fontSize={"sm"}
                      focusRing={"none"}
                      _focus={{
                        outline: "none",
                        border: "none",
                      }}
                      bg={"bg.surface"}
                      placeholder={"Caption"}
                      resize={"none"}
                      _placeholder={{
                        fontSize: "sm",
                        color: "text.secondary",
                        fontWeight: "light",
                      }}
                    />
                    {errors.post_caption && (
                      <Field.ErrorText>
                        {errors.post_caption?.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                  <Box
                    aspectRatio={1 / 1}
                    bg={"bg.surface"}
                    rounded={"lg"}
                    borderWidth={2}
                    borderStyle={"dashed"}
                    pos={"relative"}
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={() => imageInputRef?.current?.click()}
                    overflow={"hidden"}
                    className="group"
                  >
                    <Box
                      pos={"absolute"}
                      w={"full"}
                      h={"full"}
                      display={!hasImage ? "flex" : "none"}
                      flexDir={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      bg={hasImage ? "bg.surface/70" : "none"}
                      _groupHover={{
                        display: "flex",
                        bg: "bg.surface/70",
                      }}
                    >
                      <Icon size="md" color="accent.primary" mb={2}>
                        <LuUpload />
                      </Icon>
                      <Box>Click here to Add Event Image</Box>
                      <Box color="text.secondary">.png, .jpg up to 5MB</Box>
                    </Box>

                    {imagePreview !== null && (
                      <Image
                        roundedTop={"lg"}
                        src={imagePreview}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        objectPosition={"top"}
                      />
                    )}
                    {hasImage && (
                      <MiniButton
                        pos={"absolute"}
                        right={2}
                        top={2}
                        size={"2xs"}
                        bg={"red.500"}
                        fontSize={"2xs"}
                        color={"white"}
                        fontWeight={"light"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("post_image" as any, undefined);
                          if (imageInputRef.current)
                            imageInputRef.current.value = "";
                        }}
                        variant={"solid"}
                        zIndex={10}
                      >
                        Clear
                      </MiniButton>
                    )}

                    <Controller
                      control={control}
                      name="post_image"
                      rules={{
                        validate: {
                          fileSize: (files: FileList) => {
                            if (!files?.[0]) return true;
                            return (
                              files[0].size <= 5 * 1024 * 1024 || "Max 5MB"
                            );
                          },
                          fileType: (files: FileList) => {
                            if (!files?.[0]) return true;
                            return (
                              ["image/jpeg", "image/png"].includes(
                                files[0].type,
                              ) || "Only jpg/png"
                            );
                          },
                        },
                      }}
                      render={({ field: { onChange, onBlur, name } }) => (
                        <Input
                          display={"none"}
                          type="file"
                          accept="image/jpeg, image/png"
                          onChange={(e) => {
                            if (e.target.files) {
                              onChange(e.target.files);
                            }
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={imageInputRef}
                        />
                      )}
                    />
                  </Box>

                  <Button
                    onClick={handleSubmit(submitFn)}
                    disabled={isCreatingNews}
                    w={"full"}
                    size={"xl"}
                    bg={"accent.primary"}
                    rounded={"lg"}
                  >
                    Publish
                  </Button>
                </form>
              );
            }}
          />
        )}
      </Box>
    </Stack>
  );
}