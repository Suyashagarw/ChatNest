# Use Python37
FROM python:3.7
# Copy requirements.txt to the docker image and install packages
COPY requirements.txt /
RUN pip install -r requirements.txt
# Set the WORKDIR to be the folder
COPY . /app
COPY .env .env
# Expose port 8080
EXPOSE 5000
ENV PORT 5000
ENV DEBUG True
ENV REDIS_ENDPOINT_URL redis-master:6379
WORKDIR /app
# Use gunicorn as the entrypoint
CMD exec gunicorn --bind :$PORT --worker-class eventlet -w 1 app:app
