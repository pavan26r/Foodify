import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get("https://foodify-ehzi.onrender.com/api/food", { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems || [])
            })
            .catch((error) => {
                console.error("Error fetching videos:", error);
                if (error.response?.status === 401) {
                    console.log("Error is there problem in cookie ")
                } 
            })
    }, [navigate]) // Added navigate to dependency array for best practice

    async function likeVideo(item) {
        const response = await axios.post("https://foodify-ehzi.onrender.com/api/food/like", { foodId: item._id }, { withCredentials: true })

        if (response.data.like) {
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        } else {
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
    }

    async function saveVideo(item) {
        const response = await axios.post("https://foodify-ehzi.onrender.com/api/food/save", { foodId: item._id }, { withCredentials: true })

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home;