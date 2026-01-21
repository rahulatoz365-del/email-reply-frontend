# Email Reply AI Service

## Overview

A Spring Boot service that generates email replies using the OpenRouter AI API. It exposes simple REST endpoints for health checks, available tones, and reply generation.

## Tech Stack

- Java 21, Spring Boot
- Spring WebClient (HTTP client)
- Maven
- Docker (optional)

---

## Quick Start (Initialization)

### 1. Prerequisites

- Java 21 (JDK)
- Maven (or use `mvnw` wrapper)
- OpenRouter API key

Set your API key as an environment variable:

```bash
export OPEN_API_KEY=your_openrouter_api_key
```

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-org/email-reply-service.git
cd email-reply-service
```

---

### 3. Run with Maven (Development)

Build and run directly with Spring Boot:

```bash
./mvnw spring-boot:run
# or on Windows
mvnw.cmd spring-boot:run
```

The service starts on:

```text
http://localhost:8080
```

---

### 4. Run Packaged JAR (Production-like)

Build:

```bash
./mvnw clean package
```

Run:

```bash
java -jar target/email-reply-0.0.1-SNAPSHOT.jar
```

---

### 5. Run with Docker (Optional)

Build image:

```bash
docker build -t email-reply-service .
```

Run container:

```bash
docker run -p 8080:8080 -e OPEN_API_KEY=your_openrouter_api_key email-reply-service
```

---

## Main Endpoints (Summary)

- `GET /api/email/health` – Basic health info
- `GET /api/email/tones` – List available tones
- `POST /api/email/generate` – Generate email reply
```
