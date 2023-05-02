# React-isometric-game
View the online demo at: [https://rjct.github.io/react-isometric-game](https://rjct.github.io/react-isometric-game)

### About
___
This is an isometric game developed using React/Hooks, TypeScript, LESS.

Inspired by Fallout 2/Fallout Tactics and was developed as an experiment just for fun    .

### Build
___
Make sure you have `node.js` installed. 

Use `npm install` to install the dependencies.

Then run `npm start` to start development server or `npm run build` to create production build.

### Current Status
___
- ### Map
  - ### Tiles layer
    - [x] Progressive rendering
    - [x] Visual support of map-exits
    - [ ] Multiple or custom tile background (e.g. grass/road over default background)

  - ### Wireframe layer
    - [x] Progressive rendering
    - [x] Highlight unit path in walk/run mode with distance length
    - [x] <s>Highlight shoot range</s>

  - ### Fog Of War layer
    - [x] <s>Tile-based</s> Canvas-based
    - [ ] Progressive rendering

  - ### Units
    - [x] Moving
    - [x] Dynamic pathfinding ([A* algorithm](https://github.com/qiao/PathFinding.js))
    - [x] Attacking
    - [x] Health points
    - [ ] Action points
  
    - #### Hero 
      - [x] Can use weapon
      - [ ] Can fight
      - [x] Can attack
      - [x] Can go to another map
    
    - #### Enemies
      - [x] Can roam 
      - [ ] Can attack 
      - [x] Can be damaged
  
  - ### Weapon
    - [x] Single shot
    - [x] Burst shots
    - [ ] Ballistic-trajectory 
    - [ ] Area-damage for grenades

  - ### Buildings
    - [x] Basic support
    - [x] I'm too lazy to create more assets

- ### Control
  - ### Mini map
    - [x] Canvas-based
    - [ ] Progressive rendering
    - [x] Show buildingss
    - [x] Show enemies
    - [ ] Show Fog Of War
    - [x] Center map while hero is moving
  - ### Inventory
    - [x] Modal 
    - [x] Drag&drop items from/to backpack 
    - [ ] Hero summary
    - [ ] Items details
    - [ ] Group similar items
    
- ### Editor
  - [ ] Objects library
  - [x] Buildings editing
  - [ ] Units editing
  - [ ] Terrain editing

- ### Sound
  - [ ] Basic support using Web Audio API 



