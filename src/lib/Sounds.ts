export const playSound = (soundFile: string) => {
  try {
    const audio = new Audio(soundFile);
    audio.play().catch((err) => console.error("Error playing sound:", err));
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};

export const sounds = {
  error: "/error.wav",
  success: "/Success.wav",
  like: "/like.mp3",
};
