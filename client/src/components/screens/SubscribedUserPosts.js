import React from "react";
import PostList from '../PostList';
import { getHomePosts } from '../../services/postService';
import CatSVG from '../../cat-in-mailbox.svg';

const SubscribedUserPosts = () => {
    return (
        <PostList
            fetchPosts={getHomePosts}
            emptyState={
                <div className="auth-card">
                    <h5>Follow others to see their posts here</h5>
                    <img src={CatSVG} style={{ width: "400px", height: "400px" }} alt="My Icon" />
                </div>
            }
        />
    );
};

export default SubscribedUserPosts;
