FROM python:3.12

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . /mwtracks
WORKDIR /mwtracks

COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "/mwtracks/entrypoint.sh"]