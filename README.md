# Distributed Pendulums Simulation

A real-time distributed pendulum simulation built with TypeScript, Express, WebSockets, and Redis on the backend, and React on the frontend. Each pendulum runs as a separate backend instance and communicates via Redis, allowing for collision detection and synchronized behavior.

## Features

- Multiple pendulum instances communicating in real-time via Redis.
- Collision detection with optional pause-on-collision behavior.
- Dynamic pendulum properties: length, mass, and angular velocity.
- WebSocket streaming of pendulum states to the frontend.
- Interactive frontend with:
  - Start, Pause, Stop controls.
  - Toggle pendulum labels.
  - Toggle pause-on-collision behavior.
- Scalable architecture: add more pendulums by spinning up additional backend instances.

## Architecture

```bash
Frontend (React) <-- WebSockets --> Backend (Express + WS)
         ^                             ^
         |                             |
         +-------- HTTP ---------------+
         |
        Redis (Pub/Sub for state & control messages)
```

- Each backend manages a single pendulum instance.
- Redis is used for pub/sub messaging to synchronize collisions and state across instances.
- Frontend consumes state via WebSockets and renders pendulums on a canvas.

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose (for Redis)
- npm

### Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/patsaid/ts-distributed-pendulums.git
   cd ts-distributed-pendulums
   ```

2. Run using docker

   ```bash
   docker-compose up --build
   ```

3. Open in browser
   http://localhost:5173

4. Open API Docs (Swagger UI)

   The backend serves OpenAPI/Swagger documentation at: http://localhost:3000/api-docs

## Controls

- Start / Pause / Stop: control all pendulums simultaneously.
- Show/Hide Labels: toggle pendulum ID labels.
- Stop on collisions / Ignore collisions: toggle pause-on-collision behavior.

## Code Structure

### Backend (backend/)

- index.ts: server entrypoint, handles HTTP, WebSocket, Redis pub/sub, and simulation loop.
- pendulum.ts: pendulum class with physics, random initialization, and step/reset methods.
- pendulum-manager.ts: manages single pendulum instance, collisions, and Redis communication.

### Frontend (frontend/)

- components/: reusable UI components (Header, Controls).
- hooks/usePendulums.ts: WebSocket + simulation state logic.
- pages/Home.tsx: canvas rendering and main interface.
- App.tsx: root component.

## Testing

Run tests for backend/frontend:

```bash
npx vitest run --coverage
```

Run tests for frontend:

```bash
npx vitest run --coverage
```

## Future Improvements

### Fully Distributed Architecture:

Currently, both the frontend and backend need to know the total number of backend instances and their respective indexes. This limits scalability. A future version could remove this constraint by implementing a dynamic service discovery mechanism, allowing new backend instances to join or leave the cluster without requiring changes in the code. This would enable the system to scale seamlessly and operate in a fully distributed manner.

### Additional Enhancements (Ideas):

- Implement centralized state synchronization for pendulum data across instances.
- Improve frontend reactivity to handle dynamic backend additions/removals in real-time.
- Add automated tests for distributed scenarios.
