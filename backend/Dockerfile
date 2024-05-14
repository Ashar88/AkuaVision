FROM nikolaik/python-nodejs:latest

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./

RUN npm install

COPY python/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install dill

COPY . .

EXPOSE 8888

CMD ["npm", "run", "dev"]