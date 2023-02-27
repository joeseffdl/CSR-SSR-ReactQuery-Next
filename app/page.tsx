// "use client"

import { Post } from "@/types/Post"
import { dehydrate } from "@tanstack/query-core"
import { Inter } from "next/font/google"
import Link from "next/link"
import Posts from "./components/Posts"
// import { useState, useEffect } from 'react'
import getQueryClient from "./utils/getQueryClient"
import Hydrate from "./utils/hydrateClient"

const inter = Inter({ subsets: ["latin"] })

const getPosts = async () => {
  const posts: Post[] = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  )
  return posts
}

export default async function Home() {
  // // CLIENT SIDE
  // const [posts, setPosts] = useState<Post[]>([])

  // useEffect(() => {
  //   const getPosts = async () => {
  //     const res = await fetch('/api/posts')
  //     const posts= await res.json()
  //     setPosts(posts)
  //   }
  //   getPosts()
  // }, [])

  // // SERVER SIDE
  // const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  // const posts = await res.json()

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(["posts"], getPosts)
  const dehydratedState = dehydrate(queryClient)

  return (
    <main>
      <h1>Welcome Home</h1>
      <Link href="/dashboard">Navigate to dashboard</Link>

      {/* {posts.map((post: Post) => ( */}
      <Hydrate state={dehydratedState}>
        <Posts
          // key={post.id}
          // id={post.id}
          // title={post.title}
          // body={post.body}
        />
      </Hydrate>
      {/* ))} */}
    </main>
  )
}
