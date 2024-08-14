'use client'

import {
        Box,
        TextField,
        Button,
        Typography,
        Paper,
      } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from '@/firebase';
import { collection, getDocs, query, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import OpenAI from "openai";


export default function Home() {
  const [moods, setMoods] = useState([])
  const[newMood, setNewMood] = useState([])
  const[playlist, setPlaylist] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);



  const updateMoods = async () => {
    const snapshot = query(collection(firestore, 'moods'))
    const docs = await getDocs(snapshot)
    const moodList = []

    docs.forEach((doc) => {
      moodList.push({ id: doc.id, name: doc.data().name });
    })
    setMoods(moodList)
  }

  useEffect (() => {

    updateMoods()

  }, [])


  const handleAddMood = async () => {
    if (newMood.trim() === '') return; // Prevent adding empty mood

    try {
      const docRef = await addDoc(collection(firestore, 'moods'), { name: newMood });
      setMoods([...moods, { id: docRef.id, name: newMood }]); 
      setNewMood(''); 
      setSnackbarMessage('Mood added successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      setSnackbarMessage('Failed to add mood.');
      setOpenSnackbar(true);
    }
  };


  const handleRemoveMood = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'moods', id));
      setMoods(moods.filter(mood => mood.id !== id)); // Remove mood from UI
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, 
  });

  const handleGeneratePlaylist = async () => {
    try {
      const moodNames = moods.map(mood => mood.name).join(', ');
      const prompt = `Generate a 10-song playlist where each song is a blend of the following moods: ${moodNames}. Provide a mix of genres and styles that reflect these blended moods.`;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates music playlists." },
          { role: "user", content: prompt },
        ],
      });
  
      const generatedPlaylist = completion.choices[0].message.content.trim().split('\n');
      setPlaylist(generatedPlaylist);
      setSnackbarMessage('Playlist generated successfully!');
      setOpenSnackbar(true);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error generating playlist: ', error);
      setSnackbarMessage('Failed to generate playlist.');
      setOpenSnackbar(true);
    }
  };




  return (
    <Box
    width='100vw'
    height='100vh'
    bgcolor="rgba(255, 255, 255, 0.1)"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    >
      <Box
      width='80%'
      >
        <Typography
          variant="h2" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: '1px', 
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
            fontWeight: 100, 
            fontSize: '6vw', 
            color: '#f0f0f0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }} 
        >
          Introducing...
        </Typography>

        <Typography 
          variant="h2" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: '20px', 
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
            fontWeight: 140, 
            fontSize: '8vw', 
            color: '#f0f0f0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            fontStyle: 'italic'
          }}
        >
          MoodMix
        </Typography>

        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: '20px', 
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
            fontWeight: 300, 
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            color: '#f0f0f0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' 
          }}
        >
        Discover the perfect blend of emotions in every track. Whether you’re feeling up, down, or somewhere in between, our curated playlists adapt to your unique mood.
        </Typography>

      </Box>


      <Paper
        elevation={4} // Add elevation for the shadow effect
        sx={{
          width: '80%',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          borderRadius: '10px',
          height: '400px', 
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            color: '#f0f0f0',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
            fontWeight: 400, 
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
          }}
          >
          Moods
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: '20px' }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Add a Mood"
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddMood();
                e.preventDefault();
              }
            }}
            sx={{ 
              
              marginRight: '10px',  
              input: { color: '#f0f0f0' }, 
              '& .MuiInputLabel-root': {
                color: '#f0f0f0', 
            }}}
          />
          <IconButton
            color="'#f0f0f0"
            aria-label="add"
            onClick={handleAddMood}
            sx={{
              color: '#f0f0f0',
              backgroundColor: 'transparent', 
              '&:hover': {
                backgroundColor: 'lightgray', 
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            maxHeight: '300px', 
            overflow: 'auto',
          }}
        >
          {moods.map((mood) => (
            <Box 
              key={mood.id} 
              display="flex" 
              justifyContent="space-between"
              sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 0',
                color: '#f0f0f0' 
              }}
            >
              <Typography>{`${mood.name}`}</Typography>

              <IconButton
                color="'#f0f0f0"
                aria-label="delete"
                onClick={() => handleRemoveMood(mood.id)} 
                sx={{
                  color: '#f0f0f0',
                  backgroundColor: 'transparent', 
                  '&:hover': {
                    backgroundColor: 'lightgray', 
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>

            </Box>
          ))}

        </Box>

      </Paper>

      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: '20px',
          backgroundColor: '#f0f0f0',
          color: '#000',
        }}
        onClick={handleGeneratePlaylist}
      >
        Generate Playlist
      </Button>


      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Generated Playlist</DialogTitle>
        <DialogContent>
          {playlist.map((song, index) => (
            <Typography key={index}>{song}</Typography>
          ))}
        </DialogContent>
      </Dialog>

      
    </Box>

  );
}


