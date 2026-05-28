# Multi-PP IoT DIMS

This project is a multiplayer IoT quiz system with:

- a React client (`client`)
- an ASP.NET API with SSE + MQTT integration (`server`)
- a microcontroller device app (`MultiplayerController`) for hardware button input and LED output

## Features

- Lobby with real-time player joins
- Quiz flow with live answers from physical button devices
- Correct answer reveal after all players answer
- LED blink feedback on devices (green/red)
- Final results screen with player scores

## Project Structure

- `client` - React + TypeScript + Vite frontend
- `server` - .NET API, MQTT listeners, SSE publishers, auth, quiz endpoints
- `MultiplayerController` - embedded/device-side logic
- `Database.sql` - SQL schema/data script

## Requirements

- Node.js (LTS recommended)
- npm
- .NET SDK (project currently targets `net10.0`)
- PostgreSQL
- MQTT broker (for device communication)

## Getting Started

### 1) Start infrastructure

You can use Docker Compose for database-related setup:

```bash
docker compose up -d
```

Also make sure your MQTT broker is running and matches server configuration.

### 2) Run the server

```bash
cd server/api
dotnet restore
dotnet run
```

The server:

- exposes REST endpoints
- opens SSE endpoint at `/api/Subscriber/sse`
- connects to MQTT on startup
- generates TypeScript API client into `client/src/core/ServerAPI.ts`

### 3) Run the client

```bash
cd client
npm install
npm run dev
```

## Quiz Runtime Flow

1. Host creates a lobby and gets a PIN.
2. Devices join with that PIN.
3. Host starts quiz.
4. Button presses are received over MQTT and forwarded through SSE.
5. Frontend maps button color to answer index.
6. When all connected players answered:
   - correct answer is shown
   - LED blink command is sent to each answering device
7. After last question, result page shows player scores.