FROM postgres:18-alpine
# Set working directory
WORKDIR /backend

# Copy initialization SQL script
COPY movies.sql /docker-entrypoint-initdb.d/movies.sql

# Ensure the script is executable
RUN chmod +x /docker-entrypoint-initdb.d/movies.sql