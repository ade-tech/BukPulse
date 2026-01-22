import {
  Box,
  HStack,
  Skeleton,
  Stack,
  SkeletonText,
  Button,
  SkeletonCircle,
} from "@chakra-ui/react";

import { useParams } from "react-router";

import { useForm, type SubmitHandler } from "react-hook-form";

import { PostActionsDefault } from "./postActions";
import {
  useAddComment,
  useFetchCommentsForPosts,
  useFetchNewsById,
} from "@/hooks/useNews";
import PostCard from "./postCard";
import GeneralInput from "./generalInput";
import { useCurrentUser } from "@/contexts/AuthContext";
import { toaster } from "./toaster";
import { playSound, sounds } from "@/lib/Sounds";
import CommentCard, { CommentCardSkeleton } from "./CommentCard";
interface CommentInput {
  comment: string;
}

export default function NewsDetail() {
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const { post, isFetching } = useFetchNewsById(id!);
  const { comments, isFetchingComments } = useFetchCommentsForPosts(id!);
  const { mutate, isPending } = useAddComment();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CommentInput>({
    defaultValues: {
      comment: "",
    },
  });

  const submitFn: SubmitHandler<CommentInput> = ({ comment }) => {
    if (!currentUser?.id || !id) return;
    mutate(
      {
        comment,
        commenter_id: currentUser.id,
        post_id: id,
      },
      {
        onSuccess: () => {
          reset();
          playSound(sounds.success);
          toaster.create({
            title: "Posted!",
          });
        },
        onError: () => {
          playSound(sounds.error);
          toaster.error({
            title: "We could not make that happen!",
          });
        },
      },
    );
  };

  return (
    <Box
      w={"full"}
      h={"full"}
      maxW={"570px"}
      mx={"auto"}
      pt={2}
      rounded={"md"}
      overflow={"hidden"}
      display={"flex"}
      overflowY={"auto"}
      flexDir={"column"}
      className="no-scrollbar"
      pb={48}
    >
      {isFetching && (
        <Stack w={"full"} flex={1} alignItems={"center"}>
          <NewsDetailSkeleton />
        </Stack>
      )}
      {!isFetching && post && (
        <PostCard data={post} isFull={true} isShowingDetail={true} />
      )}
      {isFetchingComments && <CommentCardSkeleton />}
      {!isFetchingComments &&
        comments &&
        comments.map((cur) => (
          <CommentCard
            id={cur.id}
            post_id={cur.post_id}
            comment={cur.comment}
            commenter_id={cur.commenter_id}
            created_at={cur.created_at}
            profiles={cur.profiles}
          />
        ))}

      <Box
        pos={"fixed"}
        bottom={0}
        px={3}
        py={3}
        pb={10}
        w={"full"}
        display={"flex"}
        bg={"bg.surface"}
        alignItems={"center"}
      >
        <form
          className="flex items-center w-full"
          onSubmit={handleSubmit(submitFn)}
        >
          <GeneralInput<CommentInput>
            register={register}
            name="comment"
            errors={errors}
            type="text"
            placeholder="Enter Comment"
            border={"none"}
          />
          <Button
            disabled={!isDirty || isPending}
            variant={"ghost"}
            size={"sm"}
            color={"accent.primary"}
            fontWeight={"bold"}
            pr={3}
            type="submit"
          >
            Post
          </Button>
        </form>
      </Box>
    </Box>
  );
}
export function NewsDetailSkeleton() {
  return (
    <Stack w={"full"} bg={"bg.page"} rounded={"md"} maxW="470px" py={4} mb={4}>
      <HStack gap="4" mb={2} px={4}>
        <SkeletonCircle size="12" />
        <Stack flex="1">
          <Skeleton height="4" />
          <Skeleton height="4" width="80%" />
        </Stack>
      </HStack>
      <Box pb={1} px={4}>
        <SkeletonText noOfLines={2} rounded={"sm"} />
      </Box>
      <Box aspectRatio={1 / 1} w={"full"} overflow={"hidden"}>
        <Skeleton height="full" width="100%" />
      </Box>
      <PostActionsDefault />
    </Stack>
  );
}
