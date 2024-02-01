# B4: Hypnobuddy

## Description

Hypnobuddy is a web application built with Node.js, TypeScript, MongoDB, Jest, Vite, React, Bootstrap, and SCSS. 

It is designed to designed to enhance the effectiveness of hypnotherapy sessions, particularly for children and adolescents. The app facilitates seamless communication between hypnotherapists, young clients, and parents, empowering all parties involved.  Hypno Buddy strengthens the bond and trust between therapists and patients, emphasizing mutual collaboration. Patients receive support, visualization, and reflection to reinforce progress in their daily life without external pressure, while therapists benefit from enhanced communication for resource sharing.

This application combines the robust backend capabilities of Node.js and MongoDB with the powerful frontend framework of React and the styling flexibility of Bootstrap and SCSS.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 20.9)
- npm (version 10.2.4)
- MongoDB (version 7.0.2)

## Installation

To install Hypnobuddy, follow these steps:

### 1. Clone the repo:

```bash
git clone https://github.com/justingebert/b4-hypnobuddy.git
```

### 2. Start the terminal and switch to the Backend Folder

```bash
cd Backend
```

### 3. Install dependencies:

```bash
npm i
```

### 4. Compile TypeScript

The app is written in TypeScript so you have to compile it to Vanilla JavaScript first, the Frontend does that by starting the server, the Backend has to be done mannually by opening another terminal session going into the Backend Folder and starting the Typescript compiler like this:

```bash
tsc
```

### 5. Run the Backend

To run Hypnobuddy, use the following command:

```bash
npm run dev
```

This will start the Backend on http://localhost:8080 by default und MongoDB server on http://localhost:27017

### 6. Start another terminal and switch to the Frontend Folder

```bash
cd Frontend/hypno-buddy
```

### 7. Install dependencies:

```bash
npm i
```

### 8. Run the Frontend

```bash
npm run dev
```

This will start build and the Frontend using Vite on [http://localhost:5173](http://localhost:5173) by default.

## Unit Testing

Jest is used for writing and running tests. To run tests, use:

```bash
npm run test
```

### End-to-End Testing

Cypress is used for writing and running tests. To run tests, use:

```bash
npx cypress open
```

## Features

The features of Hypnobuddy are:

**Roadmap Feature**

- Patients set and track daily life goals, either independently or during therapy sessions.
- Therapists use patient insights to evaluate therapy effectiveness and observe progress in real life.
- The comment feature facilitates ongoing interaction, allowing therapists to guide and motivate.
- Goal: Enhance patient motivation, awareness, and appreciation of progress in their therapeutic journey.

---

**Dos and Don'ts Guide for Parents**

- Practical, therapist-created tips linked to the patient's experiences, addressing common challenges.
- Patients can view the recommendation, updated in real-time format.
- **Goal**: Enhance the effectiveness of the child's therapy process through targeted parental insights.

---

**Journaling and Mood Tracking**

- Personalized feature in Hypno Buddy for self-reflection and mood tracking.
- Simple journal interface for tracking emotions and focusing on positive aspects of the day.
- Text field for entries, sample questions for guidance, and emoji-buttons for mood representation.
- **Goal**: Empower users to track feelings, celebrate achievements, and contribute positively to their therapeutic journey.

## Troubleshooting

- delete node_modules folder
- delete package-lock.json
- run npm i again

## Development

### Available Fonts:

- Oscine
- FinalSix
- Input Serif
- Bebas Neue SemiRounded
- Novecento Sans

### How to use:

- use vars: type $ -> intellisense will show you the available vars
- For family use:
    - $oscine-family
    - $finalsix-family
    - $input-serif-family
    - $bebas-neue-semirounded-family
    - $novecento-sans-family
- For weight use:
    - $oscine-light-weight
    - $oscine-regular-weight
    - $oscine-bold-weight
    - $finalsix-light-weight
    - $finalsix-medium-weight
    - $finalsix-semibold-weight
    - $finalsix-bold-weight

## Contributing

Hypnobuddy is a university project. Contributions are not provided.

## Authors

This project was created as a semester project for HTW Berlin, Studiengang Internationale Medieninformatik (International Media and Computer Science).

This project is created by:

- Justin Gebert @justingebert
- Mai Le Phuong @maile000
- Sina Han @snahn2209
- Pia Dünow @PiaDue
- Nataliia Remezova @NataliiaRemezova
- Marwa Hariz @maria12396