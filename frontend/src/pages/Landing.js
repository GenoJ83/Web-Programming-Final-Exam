import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  useTheme,
  Stack
} from '@mui/material';
import {
  School as SchoolIcon,
  Security as SecurityIcon,
  Restaurant as RestaurantIcon,
  LocalHospital as HealthIcon,
  EmojiEvents as ActivitiesIcon,
  Groups as TeachersIcon
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Education',
      description: 'Our curriculum focuses on early childhood development and learning through play.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Safe Environment',
      description: '24/7 security monitoring and strict safety protocols to ensure your child\'s well-being.'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Healthy Meals',
      description: 'Nutritious meals and snacks prepared fresh daily by our experienced kitchen staff.'
    },
    {
      icon: <HealthIcon sx={{ fontSize: 40 }} />,
      title: 'Health & Wellness',
      description: 'Regular health checks and maintaining a clean, hygienic environment.'
    },
    {
      icon: <ActivitiesIcon sx={{ fontSize: 40 }} />,
      title: 'Fun Activities',
      description: 'Engaging activities and field trips to promote learning and social development.'
    },
    {
      icon: <TeachersIcon sx={{ fontSize: 40 }} />,
      title: 'Expert Staff',
      description: 'Qualified and experienced teachers dedicated to your child\'s growth.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url(/images/Landing.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Welcome to Daystar Daycare
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Where learning meets fun in a safe and nurturing environment
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/enrollment')}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Enroll Child
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Parent Portal
                </Button>
              </Stack>
              
              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 2,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  Staff Access
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => navigate('/login?role=manager')}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Manager Login
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => navigate('/login?role=babysitter')}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Babysitter Login
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => navigate('/register?role=staff')}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Staff Registration
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="img"
                  image="/images/playing.png"
                  alt="Daycare children playing"
                  sx={{ height: 400, objectFit: 'cover' }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                About Our Daycare
              </Typography>
              <Typography variant="body1" paragraph>
                At Daystar Daycare, we believe in providing a nurturing environment where children can learn, grow, and develop their full potential. Our experienced staff is dedicated to creating a safe and stimulating atmosphere that promotes both academic and social development.
              </Typography>
              <Typography variant="body1" paragraph>
                We offer a comprehensive curriculum that includes:
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1">• Age-appropriate learning activities</Typography>
                <Typography variant="body1">• Outdoor play and physical education</Typography>
                <Typography variant="body1">• Arts and crafts</Typography>
                <Typography variant="body1">• Music and movement</Typography>
                <Typography variant="body1">• Social skills development</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                Ready to Join Our Family?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Give your child the best start in life with Daystar Daycare
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                Enroll Today
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 