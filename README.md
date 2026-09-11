# VIERP Timetable POC

Proof-of-concept for automating timetable import and rendering for
VIERP.

The system accepts an Excel timetable, processes and validates the data,
imports it into MySQL, generates timetable JSON, and serves it through a
Grails backend to a Vue frontend.

## Quick Setup

### Requirements

Install only:

-   Git
-   Docker / Docker Desktop

You do **not** need to separately install or configure Java, Grails,
Python, Node.js, or MySQL.

### 1. Clone the repository

``` bash
git clone https://github.com/VISTRONA/vierp-timetable-poc.git
cd vierp-timetable-poc
```

If required, switch to the current POC branch:

``` bash
git checkout feature/POC-submit
```

### 2. Create the environment file

Linux / macOS:

``` bash
cp .env.example .env
```

Windows PowerShell:

``` powershell
Copy-Item .env.example .env
```

The default development values in `.env.example` can be used for the
POC.

### 3. Start the project

``` bash
docker compose up --build
```

The first run may take a few minutes while Docker downloads and builds
the required images.

### 4. Open the application

-   Frontend: `http://localhost:5173`
-   Backend health check: `http://localhost:8080/api/health`

## Starting Again

After the initial build, normally run:

``` bash
docker compose up
```

Use this when Docker configuration or dependencies have changed:

``` bash
docker compose up --build
```

## Stopping the Project

Press `Ctrl+C`, then run:

``` bash
docker compose down
```

## Resetting the Database

To delete the Docker MySQL database and recreate it from scratch:

``` bash
docker compose down -v
docker compose up --build
```

> **Warning:** `docker compose down -v` deletes the MySQL Docker volume
> and all data stored in it.

## Docker Services

The project runs three Docker services:

-   `frontend` --- Vue + Vite
-   `backend` --- Grails + Java + Python timetable pipeline
-   `mysql` --- MySQL database with automatic schema initialization

The backend communicates with MySQL internally through Docker, so
developers' locally installed MySQL instances, usernames, and passwords
do not affect the project.
