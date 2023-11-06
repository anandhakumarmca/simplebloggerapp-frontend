import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function ViewStory() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await axios.get(
          `https://simplebloggerapp.onrender.com/api/story/${storyId}`
        );

        if (response.status === 200) {
          setStory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching the story:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [storyId]);

  const handleDeleteStory = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        // Handle the case where the user is not authenticated
        console.error("User is not authenticated");
        window.alert("Login to delete");
        return;
      }

      const response = await axios.delete(
        `https://simplebloggerapp.onrender.com/api/story/${storyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        window.alert("Story deleted successfully");
        // Story deleted successfully, you can redirect the user or show a success message
        navigate("/", { state: { message: "Story deleted successfully" } });
      } else if (response.status === 404) {
        console.error("Story not found on the server.");
        // You can also display an error message to the user.
      } else {
        console.error("An unexpected error occurred during deletion.");
        navigate("/"); // Handle the error as needed, such as displaying an error message to the user.
        // Handle other status codes as needed.
      }
    } catch (error) {
      console.error("Error deleting the story:", error);
      navigate("/"); // Handle the error as needed, such as displaying an error message to the user.
    }
  };

  return (
    <Container fluid className="full-screen-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-secondary">
          Back
        </Link>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : story ? (
        <Card className="view-story-card">
          {story.image && (
            <Card.Img variant="top" src={story.image} alt={story.title} />
          )}
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Link
                  to={`/EditStory/${storyId}`}
                  className="btn btn-primary me-3"
                >
                  Edit
                </Link>
              </div>
              <Button
                variant="danger"
                // You can add a delete confirmation dialog here
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this story?"
                    )
                  ) {
                    // Call the delete function
                    handleDeleteStory();
                  }
                }}
              >
                Delete
              </Button>
            </div>
            <Card.Title>{story.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {story.summary}
            </Card.Subtitle>
            <Card.Text>{story.content}</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-center">Story not found.</p>
      )}
    </Container>
  );
}
