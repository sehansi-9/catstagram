import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../PostCard';
import { getPostById } from '../../services/postService';
import usePostInteractions from '../../hooks/usePostInteractions';

const OnePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const result = await getPostById(id);
                setPost(result.post);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPost();
    }, [id]);

    const onPostUpdated = (updatedPost) => {
        setPost(updatedPost);
    };

    const onPostDeleted = (deletedPost) => {
        navigate('/profile');
    };

    const {
        handleLike,
        handleUnlike,
        handleComment,
        handleDeletePost,
        handleDeleteComment
    } = usePostInteractions(onPostUpdated, onPostDeleted);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="home">
            <PostCard
                post={post}
                onLike={handleLike}
                onUnlike={handleUnlike}
                onComment={handleComment}
                onDeletePost={handleDeletePost}
                onDeleteComment={handleDeleteComment}
            />
        </div>
    );
};

export default OnePost;
