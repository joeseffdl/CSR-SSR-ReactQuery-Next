"use client"

import { Post } from "@/types/Post"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

export default function Posts(
  // { id, title, body }: Post
) {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((res) => res.json()),
  })

  const queryClient = useQueryClient()
  
  const deleteHandler = async (postToDelete: Post) => {
    const res = await fetch(`/api/posts`, {
      method: "DELETE",
    })
    const data = await res.json()
    console.log(data)
  }

  const mutation = useMutation({
    mutationFn: deleteHandler,
    onMutate: async (postToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previousPosts = queryClient.getQueryData(["posts"])
      queryClient.setQueryData(["posts"], old.filter((post: Post) => post.id !== postToDelete.id))
      return { previousPosts }
    },
    onError: (err, post, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onSuccess: (data, variables, context) => {
      console.log(data)
    }
  })

  return (
    <div>
      <h1>Posts</h1>
      {data.map((post: Post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <button onClick={() => mutation.mutate(post)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
