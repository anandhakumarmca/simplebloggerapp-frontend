import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";

export default function EditStory() {
  const { storyId } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function fetchStoryToEdit() {
      try {
        const response = await axios.get(
          `https://simplebloggerapp.onrender.com/api/story/${storyId}`
        );

        if (response.status === 200) {
          const story = response.data.data;
          setTitle(story.title);
          setSummary(story.summary);
          setContent(story.content);
          setImage(story.image);
        } else {
          console.error("Failed to fetch the story. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    }

    fetchStoryToEdit();
  }, [storyId]);

  async function updateStory(ev) {
    ev.preventDefault();

    // Get the authentication token from localStorage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      // Handle the case where the user is not authenticated
      console.error("User is not authenticated");
      return;
    }

    const storyData = {
      title,
      summary,
      content,
      image,
    };

    try {
      const response = await axios.put(
        `https://simplebloggerapp.onrender.com/api/story/${storyId}`,
        storyData
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${authToken}`,
        //   },
        // }
      );

      if (response.status === 200) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error updating the story:", error);
    }
  }

  if (redirect) {
    return (
      <Navigate
        to="/
    "
      />
    );
  }

  return (
    <Container className="mt-5 create-story-container">
      <h2>Edit Story</h2>
      <Form onSubmit={updateStory}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Summary:</Form.Label>
          <Form.Control
            type="text"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content:</Form.Label>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(ev) => setContent(ev.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL (Optional):</Form.Label>
          <Form.Control
            type="text"
            value={image}
            onChange={(ev) => setImage(ev.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="submit-button">
          Update Story
        </Button>
      </Form>
    </Container>
  );
}
