FROM python:3.11.1-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    nginx \
    libc-dev \
    nginx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code
COPY . /code/

RUN pip install -r requirements.txt

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 8000

CMD ["uvicorn", "sockets:app", "--host", "0.0.0.0", "--port", "8000"]