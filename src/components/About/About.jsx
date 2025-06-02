import React from 'react';
import './About.css';

export default function About() {
    return (
        <div className="about-page">
            <h1 className="about-title">About</h1>
            <div className="about-container">
                <p>In brainstorming for our project, one Sustainable Development Goal (SDG) that stood out to us the most was #4: Quality Education. This goal emphasizes inclusive and equitable quality education and promotes lifelong learning opportunities for all. While formal education is a core part of this SDG, we also believe that cultivating personal reading habits outside of academic requirements contributes to essential learning habits such as critical thinking, continuous learning, and empathy. </p>
                <p>To narrow down this goal, we asked ourselves: How might we leverage social connections and goal-setting to motivate undergraduate students to read more for pleasure and better engage with the books they choose to read? We wanted to focus on the importance of motivation and the role of community when it comes to developing healthy reading habits. Although many college students express interest in wanting to read more, academic stress and a lack of time and motivation limits their engagement with reading. </p>
                <p>Our current understanding of the problem is that, although students have access to physical and digital books, they often struggle to develop consistent reading habits due to a lack of motivation, accountability, and community support. Reading can also feel isolating, as students may not have an outlet to share their thoughts, discuss interpretations, or receive personalized recommendations—further distancing them from the enjoyment of reading. Research supports this understanding, showing that students' reading habits are strongly shaped by social factors such as the educational environment, academic pressures, and the availability of free time (Onel & Durdukoca, 2021). Without structured social engagement and a supportive community, students are less likely to prioritize recreational reading, even if they express a genuine desire to read more for pleasure.</p>
                <p>Our project aims to address the lack of social connectedness and motivation around reading for pleasure among undergraduate students. We believe that by incorporating features such as friend connections, book ratings, reading goals, public/private annotations, and personalized book recommendations, we can help students feel more connected to their reading journey and each other, along with encouraging lifelong learning.</p>
            </div>
            <div className="video-container">
                <iframe
                    src="https://www.youtube.com/embed/mCU3n6y-uaU"
                    title="SDG 4: Quality Education"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
} 