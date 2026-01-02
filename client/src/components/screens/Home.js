import PostList from '../PostList';
import { getAllPosts } from '../../services/postService';

const Home = () => {
    return (
        <PostList fetchPosts={getAllPosts} />
    );
};

export default Home;
