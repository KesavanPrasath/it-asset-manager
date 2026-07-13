#Python base image
FROM python:3.10-slim

#working directory inside the container
WORKDIR /app


COPY . .


RUN pip install flask flask-cors gunicorn


EXPOSE 8080

# Running Flask app using gunicorn production server
CMD ["python", "backend/app.py"]
