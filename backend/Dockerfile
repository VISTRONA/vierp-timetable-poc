FROM eclipse-temurin:17-jdk-jammy

RUN apt-get update \
    && apt-get install -y \
        python3 \
        python3-pip \
        python3-venv \
        curl \
        unzip \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY database/pipeline/requirements.txt /app/database/pipeline/requirements.txt

RUN pip install --no-cache-dir \
    -r /app/database/pipeline/requirements.txt

COPY backend /app/backend
COPY database /app/database
COPY storage /app/storage

WORKDIR /app/backend

RUN chmod +x gradlew

# RUN ./gradlew classes --no-daemon

EXPOSE 8080

CMD ["./gradlew", "bootRun", "--no-daemon"]
