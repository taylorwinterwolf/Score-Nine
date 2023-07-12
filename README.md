# Score Nine

This site was built using React JS and is hosted with Firebase Cloud Hosting [View Site](https://taylortay.com/scorenine/) 

Score Nine pool scorekeeping web application, built with React JS, utilizes various features such as context, useState, and useEffect. It tracks the scores and points needed for two players, while managing the state of nine balls with three options (potted, dead, or still on the table) and accounting for special conditions of the nine ball. Users can easily input scores, view standings, and receive visual feedback on the current player's turn and exceptional events. This user-friendly app effectively handles the game state, ensuring an efficient and enjoyable Nine Ball pool experience. Click around, take it for a spin and have fun!

## App features and usage

- **Changing Ball State**
  - Click on any ball to change it's state from on the table to potted. Click the ball again and it's state changes to dead. Click the ball a third time and it gets reset.
- **Visual Representation of Ball State**
  - When balls are click in repetition they visually change to represent their current state. Ball icons also get placed in the active players section or in the Dead Balls section.
- **Score Updates**
  - The score updates every time a ball is clicked to accurately represent the score
- **Turnovers**
  - Seamlessly switch the active player
- **Rack State**
  - Every time there is a turn over, any downed balls are removed from the available balls. When the nine is potted and start new rack is selected, all current scores and stats remain while the rack resets for the next rack. The current rack number is counted and displayed
- **Edit Players**
  - This displays a modal that allows the user to add two custom players with custom skill levels. The points needed are dynamically generated depending on skill level selected
- **Edit Rack**
  - The most robust feature of this app, Edit Rack gives you the ability to relocate any potted ball to any potential location all in one button push after desired options are selected. 
- **Replay Match**
  - Do you want a rematch! Just select Replay Match after a winner is determined and bring your A game to prove your worth   
- **Data Persistence**
  - All data is stored in local storage for each user. The data will persist upon page refresh or close.
- **Responsive Design**
  - This app works seamlessly across different devices for an optimal user experience

---

## Interface Images

### Landing Page

![Image](https://taylortay.com/scorenine/screengrabs/landingpage.png)

### App In Action

![Image](https://taylortay.com/scorenine/screengrabs/activepage.png)

### Add Custom Players Modal

![Image](https://taylortay.com/scorenine/screengrabs/addcustomplayers.png)

### Edit Rack

![Image](https://taylortay.com/scorenine/screengrabs/editrack.png)

### Winner Modal

![Image](https://taylortay.com/scorenine/screengrabs/winnermodal.png)

