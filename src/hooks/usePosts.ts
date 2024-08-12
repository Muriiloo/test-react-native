import { useState, useEffect } from "react";
import axios from "axios";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

type SelectedPost = Post & {
  comments: Comment[];
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data.slice(0, 10));
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const fetchPostDetails = async (postId: number) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        throw new Error("Post não encontrado");
      }
      const commentsResponse = await axios.get<Comment[]>(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      setSelectedPost({ ...post, comments: commentsResponse.data });
    } catch (error) {
      console.error("Erro ao buscar detalhes do post:", error);
    }
  };

  const updatePost = async (post: Partial<Post>) => {
    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/posts/${post.id}`,
        post
      );
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === post.id ? { ...p, ...post } : p))
      );
      console.log("Post atualizado com sucesso:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao atualizar o post:",
          error.response?.data || error.message
        );
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  };

  const publishPost = async (newPost: Omit<Post, "id">) => {
    try {
      const response = await axios.post<Post>(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      const createdPost = { ...response.data, id: posts.length + 1 };
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error("Erro ao publicar o post:", error);
    }
  };

  return { posts, fetchPostDetails, selectedPost, publishPost, updatePost };
};
