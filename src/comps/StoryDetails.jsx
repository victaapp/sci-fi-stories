import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  Paper, 
  Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Utility Variables ---
const BASE_API_URL = "https://mxpertztestapi.onrender.com/api/sciencefiction/";
const BASE_IMAGE_URL = "https://ik.imagekit.io/dev24/";
const PLACEHOLDER_TEXT = "Description or content not available for this section.";
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/333/fff?text=Image+Missing";

// --- Styled Components ---

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(26,20,53,1) 35%, rgba(13,10,29,1) 100%)",
  color: "#fff",
  padding: theme.spacing(4, 0),
}));

const TitleBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2, 0, 4, 0),
  background: 'rgba(0, 0, 0, 0.3)', 
}));

const NavigationButton = styled(Button)(({ theme, active }) => ({
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '30px',
  margin: theme.spacing(0, 1),
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  backgroundColor: active 
    ? '#5350FF'
    : 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: active 
      ? '#4643CC' 
      : 'rgba(255, 255, 255, 0.2)',
  },
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#fff',
  padding: theme.spacing(3),
  borderRadius: '15px',
  height: '100%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ImageContainer = styled(Box)({
  width: '100%',
  height: 'auto',
  minHeight: 180,
  borderRadius: '10px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '15px',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
});

// --- Utility Functions ---

const getStoryImage = (story) => {
    if (story?.Image?.length > 0) return BASE_IMAGE_URL + story.Image[0];
    return PLACEHOLDER_IMAGE;
};


// --- Component: Word Explorer View ---
const WordExplorerView = ({ story }) => {
    const wordItems = story.Wordexplore || [];

    if (wordItems.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ color: '#aaa', mt: 4 }}>
                No vocabulary words found for this Word Explorer.
            </Typography>
        );
    }
    
    // Using the original ContentCard styling for the dark theme.
    const WordDetailCard = ({ word }) => {
        const wordImage = word.Storyimage?.[0] ? BASE_IMAGE_URL + word.Storyimage[0] : PLACEHOLDER_IMAGE;
        
        return (
            <ContentCard 
                sx={{ 
                    p: 4, // Increase padding for better look
                    height: 'auto'
                }}
            >
                <Typography variant="h4" sx={{ color: '#5350FF', fontWeight: 'bold' }}>
                    {word.Noun || word.Storytitle}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#aaa' }}>
                    {word.Storytitle || word.Noun}
                </Typography>

                {/* Image Section */}
                <ImageContainer sx={{ height: 250, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <img src={wordImage} alt={word.Storytitle} />
                </ImageContainer>
                
                {/* Definition/Context Section */}
                <Box sx={{ mt: 3, pb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                        {word.Storyttext || PLACEHOLDER_TEXT}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
                        {word.Storyitext}
                    </Typography>
                </Box>
                
                {/* Synonyms/Antonyms Section */}
                <Box sx={{ pt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        Synonyms: <span style={{ color: '#fff', fontWeight: 'normal' }}>{word.Synonyms || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#E53935', fontWeight: 'bold' }}>
                        Antonyms: <span style={{ color: '#fff', fontWeight: 'normal' }}>{word.Antonyms || 'N/A'}</span>
                    </Typography>
                </Box>
            </ContentCard>
        );
    }

    return (
        // Use a single column for a simple, clear, full-width presentation of each word
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {wordItems.map((word, index) => (
                <WordDetailCard key={word._id || index} word={word} />
            ))}
        </Box>
    );
};


// --- Component: Story Adventure View ---
const StoryAdventureView = ({ story }) => {
    const storySections = story.Storyadvenure?.content || [];

    if (storySections.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ color: '#aaa', mt: 4 }}>
                No adventure content found for this story.
            </Typography>
        );
    }
    
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#5350FF' }}>
                {story.Storyadvenure?.Storytitle || 'Story Adventure'}
            </Typography>
            {storySections.map((section, index) => (
                <ContentCard key={section._id || index} sx={{ my: 3, p: 3 }}>
                    {section.Storyimage?.[0] && (
                        <ImageContainer sx={{ height: 300 }}>
                            <img 
                                src={BASE_IMAGE_URL + section.Storyimage[0]} 
                                alt={`Section ${index + 1} illustration`} 
                            />
                        </ImageContainer>
                    )}
                    {section.Paragraph?.map((para, paraIndex) => (
                        <Typography variant="body1" key={paraIndex} sx={{ mb: 1.5, lineHeight: 1.8 }}>
                            {para}
                        </Typography>
                    ))}
                </ContentCard>
            ))}
        </Box>
    );
};


// --- Component: Brain Quest View ---
const BrainQuestView = ({ story }) => {
    const questions = story.Brainquest || [];
    const [selectedAnswers, setSelectedAnswers] = useState({});
    
    const handleAnswerClick = (questionId, option) => {
        if (!selectedAnswers[questionId]) {
            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: option 
            }));
        }
    };

    if (questions.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ color: '#aaa', mt: 4 }}>
                No quiz questions found for this Brain Quest.
            </Typography>
        );
    }
    
    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#FFC107' }}>
                🧠 Brain Quest Quiz
            </Typography>
            
            {questions.map((q, index) => {
                const questionId = q._id;
                const selectedOption = selectedAnswers[questionId];
                const isAnswered = !!selectedOption;
                
                return (
                    <ContentCard key={questionId} sx={{ my: 3, p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Q{index + 1}: {q.Question}
                        </Typography>
                        
                        <Grid container spacing={1}>
                            {q.Option?.map((option, optIndex) => {
                                const isCorrect = option === q.Answer;
                                const isSelected = option === selectedOption;
                                
                                // Conditional styling logic:
                                let buttonStyles = {
                                    justifyContent: 'center', // Center text to match the image
                                    textTransform: 'uppercase', 
                                    fontWeight: 'bold',
                                    backgroundColor: 'transparent',
                                    color: '#fff', 
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                };

                                if (isAnswered) {
                                    if (isCorrect) {
                                        // Correct answer: Show Green text/border
                                        buttonStyles.color = '#4CAF50'; 
                                        buttonStyles.borderColor = '#4CAF50';
                                        if (isSelected) {
                                            buttonStyles.backgroundColor = 'rgba(76, 175, 80, 0.2)'; 
                                        }
                                        
                                    } else if (isSelected && !isCorrect) {
                                        // Incorrectly selected answer: Show Red text/border and subtle background fill
                                        buttonStyles.color = '#E53935'; 
                                        buttonStyles.borderColor = '#E53935';
                                        buttonStyles.backgroundColor = 'rgba(229, 57, 53, 0.2)';
                                    }
                                    
                                    if (!isSelected && !isCorrect) {
                                        buttonStyles.opacity = 0.6;
                                        buttonStyles.color = '#fff';
                                        buttonStyles.borderColor = 'rgba(255, 255, 255, 0.2)'; 
                                    }

                                } else {
                                     buttonStyles['&:hover'] = {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderColor: '#5350FF'
                                     }
                                }

                                return (
                                    <Grid item xs={12} sm={6} key={optIndex}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            // disabled={isAnswered}
                                            onClick={() => handleAnswerClick(questionId, option)}
                                            sx={buttonStyles}
                                        >
                                            {option}
                                        </Button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        
                        {isAnswered && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#999', textAlign: 'center' }}>
                                (Answer: {q.Answer})
                            </Typography>
                        )}
                    </ContentCard>
                );
            })}
        </Box>
    );
};


// --- Main StoryDetails Component ---

export default function StoryDetails() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState('Word Explorer'); 

  const fetchStoryDetails = useCallback(async () => {
    const API_URL = `${BASE_API_URL}${storyId}`;
    
    setLoading(true);
    setError(null);
    setStory(null);

    try {
      const response = await axios.get(API_URL);
      
      if (response.data && response.data.Title) {
          setStory(response.data);
      } else {
          throw new Error("Story not found or incomplete data.");
      }
      
    } catch (err) {
      console.error("Error fetching story details:", err);
      setError("Failed to load story details. The story ID might be invalid.");
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (storyId) {
      fetchStoryDetails();
    }
  }, [storyId, fetchStoryDetails]);


  // --- Render UI based on state ---

  const renderActiveModeContent = () => {
    if (!story) return null;

    switch (activeMode) {
      case 'Word Explorer':
        return <WordExplorerView story={story} />;
      case 'Story Adventure':
        return <StoryAdventureView story={story} />;
      case 'Brain Quest':
        return <BrainQuestView story={story} />;
      default:
        return (
          <Typography variant="h6" align="center" sx={{ color: '#aaa', mt: 4 }}>
            Select a mode above to start.
          </Typography>
        );
    }
  };

  const renderPageContent = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2, color: '#aaa' }}>
            Loading Story: {storyId}...
          </Typography>
        </Box>
      );
    }

    if (error || !story) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error">
            {error || "Story Data Not Available"}
          </Typography>
          <Button onClick={() => navigate('/')} variant="contained" sx={{ mt: 3 }}>
            Go back to Stories
          </Button>
        </Box>
      );
    }
    
    const storyTitle = story.Title || "Story Title";

    return (
      <Box>
        {/* 1. Title Header */}
        <TitleBox>
          <Typography variant="h3" fontWeight="bold">
            {storyTitle}
          </Typography>
        </TitleBox>

        {/* 2. Mode Navigation Buttons */}
        <Box display="flex" justifyContent="center" my={4}>
          <NavigationButton 
            active={activeMode === 'Word Explorer'}
            onClick={() => setActiveMode('Word Explorer')}
          >
            <Typography>
                <span role="img" aria-label="magnifying glass">🔍</span> Word Explorer
            </Typography>
          </NavigationButton>
          <NavigationButton 
            active={activeMode === 'Story Adventure'}
            onClick={() => setActiveMode('Story Adventure')}
          >
            <Typography>
                <span role="img" aria-label="rocket">🚀</span> Story Adventure
            </Typography>
          </NavigationButton>
          <NavigationButton 
            active={activeMode === 'Brain Quest'}
            onClick={() => setActiveMode('Brain Quest')}
          >
            <Typography>
                <span role="img" aria-label="brain">🧠</span> Brain Quest
            </Typography>
          </NavigationButton>
        </Box>

        {/* 3. Dynamic Content Area */}
        {renderActiveModeContent()}
        
      </Box>
    );
  };


  // --- Final Render ---

  return (
    <BackgroundBox>
      <Container maxWidth="lg">
        {renderPageContent()}
      </Container>
    </BackgroundBox>
  );
}