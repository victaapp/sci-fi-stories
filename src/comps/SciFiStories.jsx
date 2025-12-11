import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
// 🌟 CRITICAL ADDITION: Import useNavigate for routing
import { useNavigate } from "react-router-dom"; 
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Utility Variables ---
const API_BASE_URL = "https://ik.imagekit.io/dev24/";
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/333/fff?text=The+Galactic+Time+Travelers";
const API_URL = "https://mxpertztestapi.onrender.com/api/sciencefiction";

// --- Styled Components for the UI ---

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(26,20,53,1) 35%, rgba(13,10,29,1) 100%)",
  padding: theme.spacing(4),
  color: "#fff",
}));

const HeaderBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0, 0, 4, 0),
  "& .logo": {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 40,
      marginRight: theme.spacing(1),
    },
  },
}));

const StatusButton = styled(Button)(({ theme, status }) => {
  let backgroundColor = "rgba(255, 255, 255, 0.1)";
  let color = "#fff";
  let activeStyles = {};

  switch (status) {
    case "New":
      activeStyles = { backgroundColor: "#5350FF", color: "#fff" };
      break;
    case "In Progress":
      activeStyles = { backgroundColor: "#FFC107", color: "#000" };
      break;
    case "Completed":
      activeStyles = { backgroundColor: "#4CAF50", color: "#fff" };
      break;
    case "All":
    default:
      activeStyles = { backgroundColor: "#5350FF", color: "#fff" };
      break;
  }

  return {
    backgroundColor: backgroundColor,
    color: color,
    borderRadius: "20px",
    padding: theme.spacing(0.5, 3),
    marginRight: theme.spacing(2),
    fontWeight: "bold",
    // Use dynamic styles for the active state
    "&.Mui-active": activeStyles,
    "&:hover": {
      opacity: 0.8,
      backgroundColor: backgroundColor,
    },
  };
});

const StoryCard = styled(Card)(({ theme, status }) => {
  let statusColor = "";
  switch (status) {
    case "New":
      statusColor = "#5350FF";
      break;
    case "In Progress":
      statusColor = "#FFC107";
      break;
    case "Completed":
      statusColor = "#4CAF50";
      break;
    default:
      statusColor = "#fff";
  }

  return {
    background: "rgba(255, 255, 255, 0.05)",
    border: `2px solid ${statusColor}`,
    borderRadius: "15px",
    cursor: "pointer", // 🌟 Ensure cursor is a pointer 🌟
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: `0 0 20px ${statusColor}`,
    },
  };
});

const StoryCardMedia = styled(CardMedia)({
  height: 180,
  objectFit: "cover",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
});

const StatusLabel = styled(Typography)(({ theme, status }) => {
  let statusColor = "";
  switch (status) {
    case "New":
      statusColor = "#5350FF";
      break;
    case "In Progress":
      statusColor = "#FFC107";
      break;
    case "Completed":
      statusColor = "#4CAF50";
      break;
    default:
      statusColor = "#fff";
  }

  return {
    textAlign: "center",
    fontWeight: "bold",
    color: statusColor,
    padding: theme.spacing(1, 0),
    borderTop: `1px solid ${statusColor}`,
    textTransform: "uppercase",
  };
});

// --- Utility Functions ---

const getStoryStatus = (story) => {
  if (story.Status === "Published") return "Completed";

  const statuses = ["New", "In Progress", "Completed"];
  if (story._id) {
    // Demo logic using the last char of _id for pseudo-random status
    const demoIndex = story._id.charCodeAt(story._id.length - 1) % 3; 
    return statuses[demoIndex];
  }
  return "New";
};

const getStoryImage = (story) => {
  if (story?.Image?.length > 0) return API_BASE_URL + story.Image[0];
  if (story?.Storyadvenure?.content?.length > 0) {
    const firstContent = story.Storyadvenure.content[0];
    if (firstContent?.Storyimage?.length > 0)
      return API_BASE_URL + firstContent.Storyimage[0];
  }
  return PLACEHOLDER_IMAGE;
};


// --- Main Component ---

export default function SciFiStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 12;

  // 🌟 CRITICAL ADDITION: Initialize useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(API_URL);
        // Using a subset for demo purposes
        setStories(response.data.slice(0, 15)); 
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Memoized filter logic
  const filteredStories = useMemo(() => {
    setCurrentPage(1); 
    if (filter === "All") return stories;

    return stories.filter((story) => getStoryStatus(story) === filter);
  }, [stories, filter]);

  // Pagination logic
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(
    indexOfFirstStory,
    indexOfLastStory
  );
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);


  // --- Handlers ---

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterClick = (status) => {
    setFilter(filter === status ? "All" : status); 
  };
  
  // 🌟 NEW HANDLER: Function to navigate when a card is clicked
  const handleCardClick = (storyId) => {
      // Navigate to a detail page. Assuming the route is '/story-details/:id'
      navigate(`/story-details/${storyId}`); 
      // You can replace '/story-details/' with your actual detail route path
  };

  // --- Rendered JSX ---
  return (
    <BackgroundContainer>
      <Container maxWidth="lg"> 
        
        {/* Header Bar */}
        <HeaderBar>
          <Box className="logo">
            <img src="https://i.imgur.com/gK9p0Z0.png" alt="BrainyLingo Logo" />
            <Typography variant="h6" fontWeight="bold">
              BrainyLingo
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography component="a" href="#" sx={{ color: "#fff" }}> Home </Typography>
            <Typography component="a" href="#" sx={{ color: "#fff" }}> Leaderboard </Typography>
            <Typography component="a" href="#" sx={{ color: "#fff" }}> Daily Quiz </Typography>
            <Button variant="contained" color="primary"> Sign Out </Button>
          </Box>
        </HeaderBar>

        {/* Main Content Title */}
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h3" fontWeight="bold">
            Science Fiction Stories
          </Typography>
        </Box>

        {/* Filter Bar */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={4}
          mt={2}
        >
          {["All", "New", "In Progress", "Completed"].map((status) => (
            <StatusButton
              key={status}
              status={status}
              onClick={() => handleFilterClick(status)}
              // Apply 'Mui-active' class when the filter matches the status
              className={filter === status ? 'Mui-active' : ''} 
              sx={{
                 // Override the StatusButton default color logic when active
                backgroundColor: filter === status ? undefined : "rgba(255, 255, 255, 0.1)",
                border: filter === status && status === "All" ? "2px solid #fff" : "none",
              }}
            >
              {status === "New" && "✨ "} 
              {status === "In Progress" && "⚙️ "}
              {status === "Completed" && "✅ "}
              {status}
            </StatusButton>
          ))}

          {/* Clear All Button */}
          <Button
            variant="contained"
            onClick={() => { /* Add Clear All logic here */ }}
            sx={{
              backgroundColor: "#E53935",
              color: "#fff",
              borderRadius: "20px",
              padding: "4px 24px",
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            Clear All
          </Button>
        </Box>

        <hr style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }} />

        {/* Loading/Error States */}
        {loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ mt: 2, color: "#aaa" }}>
              Loading Stories...
            </Typography>
          </Box>
        )}

        {/* Stories Grid */}
        {!loading && filteredStories.length > 0 && (
          <Grid 
            container 
            spacing={4} 
            sx={{ mt: 2, pb: 4 }}
            justifyContent="center"
          >
            {currentStories.map((story) => {
              const status = getStoryStatus(story);
              const imageUrl = getStoryImage(story);
              const title = story.Title || "The Galactic Time Travelers";

              return (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={3} 
                  key={story._id}
                  sx={{
                    width: { md: '25%' },
                    flexGrow: 0,
                    maxWidth: { md: '25%' }, 
                    boxSizing: 'border-box'
                  }}
                >
                  <StoryCard 
                    status={status} 
                    // 🌟 CRITICAL CHANGE: Call the navigation handler on card click 🌟
                    onClick={() => handleCardClick(story._id)}
                  >
                    <StoryCardMedia
                      image={imageUrl}
                      title={title}
                      sx={{
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        background: "rgba(0, 0, 0, 0.3)",
                        py: 1,
                        px: 1.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        align="center"
                        fontWeight="medium"
                        sx={{ color: "#fff" }}
                      >
                        {title}
                      </Typography>
                    </CardContent>
                    <StatusLabel status={status}>{status}</StatusLabel>
                  </StoryCard>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            Page {currentPage} of {totalPages}
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff", 
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#5350FF", 
                color: "#fff",
              },
            }}
          />
          <Box display="flex" gap={2}>
            <Button
              onClick={() => handlePageChange(null, currentPage - 1)}
              disabled={currentPage === 1}
              size="small"
              sx={{ color: "#fff" }}
            >
              &lt; Previous
            </Button>
            <Button
              onClick={() => handlePageChange(null, currentPage + 1)}
              disabled={currentPage === totalPages}
              size="small"
              sx={{ color: "#fff" }}
            >
              Next &gt;
            </Button>
          </Box>
        </Box>
      </Container>
    </BackgroundContainer>
  );
}