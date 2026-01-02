import React, { useState, useEffect } from "react";
import PostCard from './PostCard';
import usePostInteractions from '../hooks/usePostInteractions';

const PostList = ({ fetchPosts, emptyState }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const result = await fetchPosts();
                setData(result.posts);
            } catch (err) {
                console.log(err);
            }
        };
        loadPosts();
    }, [fetchPosts]);

    const onPostUpdated = (updatedPost) => {
        const newData = data.map(item => {
            if (item._id === updatedPost._id) {
                return updatedPost;
            } else {
                return item;
            }
        });
        setData(newData);
    };

    const onPostDeleted = (deletedPost) => {
        const newData = data.filter(item => item._id !== deletedPost._id);
        setData(newData);
    };

    const {
        handleLike,
        handleUnlike,
        handleComment,
        handleDeletePost,
        handleDeleteComment
    } = usePostInteractions(onPostUpdated, onPostDeleted);

    return (
        <div className="home">
            {data.length === 0 && emptyState}
            {data.map(item => (
                <PostCard
                    key={item._id}
                    post={item}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                    onComment={handleComment}
                    onDeletePost={handleDeletePost}
                    onDeleteComment={handleDeleteComment}
                />
            ))}
        </div>
    );
};

export default PostList;
