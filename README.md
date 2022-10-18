# Opencracia

Opencracia is an open source tool to encourage citizens to release their own instances of digital democracy.

## Getting started

Set up Opencracia by cloning the template:
```
git clone 
```

## Modules

Currently, Opencracia supports four modules for participation: Pairwise comparison, Approval voting, Ranking voting, and Fallback voting.

## Database

Opencracia is built to store data on PostgreSQL.
```
CREATE ROLE my_user WITH ENCRYPTED PASSWORD 'my_password';
CREATE DATABASE my_database OWNER my_user;

GRANT ALL PRIVILEGES ON DATABASE my_database TO my_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO my_user;

ALTER ROLE my_user WITH LOGIN;
```

```
psql -d my_database -h 127.0.0.1 -U my_user
```

```
CREATE TABLE IF NOT EXISTS agree(
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  ip_hash VARCHAR NOT NULL,
  proposal_id INT NOT NULL,
  agree INT NOT NULL,
  universe INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score DECIMAL NOT NULL,
  locale VARCHAR NOT NULL,
  option VARCHAR
);

CREATE TABLE IF NOT EXISTS consent(
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  ip_hash VARCHAR NOT NULL,
  universe INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  locale VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS rank(
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  ip_hash VARCHAR NOT NULL,
  rank VARCHAR NOT NULL,
  updated INT NOT NULL,
  universe INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score DECIMAL NOT NULL,
  locale VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS participant(
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  ip_hash VARCHAR NOT NULL,
  politics_id INT NOT NULL,
  location_id VARCHAR NOT NULL,
  age_id INT NOT NULL,
  sex_id VARCHAR NOT NULL,
  zone_id INT NOT NULL,
  education_id INT NOT NULL,
  universe INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score DECIMAL NOT NULL,
  locale VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS access_log(
  id SERIAL PRIMARY KEY,
  user_id UUID,
  ip_hash VARCHAR,
  universe INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);
```

## Platforms in multiple languages

One can create the platform in many languages (lang = en, es, pt, ?). The files inside the folder "locales/{lang}" are used to create all the elements' labels. 

In order to create these files, you can create a .tsv on the following format:

|       key        |        en        |        es        |        pt        |
|   ------------   |   ------------   |   ------------   |   ------------   |
|   website.name   |    Opencracia    |    Opencracia    |    Opencracia    |
|   menu.results   |    Results       |    Resultados    |    Resultados    |


Then, run the following python file:
Don't forget to change the path for the .tsv file. 
Either you add the file inside the folder "public/data/opencracia_elements.tsv"
or you can connect to a Google Sheets file (on the Google Sheets file, click on: File -> Share -> Publish to web -> Publish as .tsv -> use this link).  

```
python scripts/updateElementTitles.py 
```


## Platforms inspired by Opencracia

- [Mon Programme 2022](https://monprogramme2022.org): A digital tool to create a government program for the 2022 French Presidential Election.

- [Brazucracia](https://brazucracia.org): A digital tool to create a government program for the 2022 Brazilian Presidential Election.

## Contributing

We encourage developers and hack-activists to send their Pull Requests to Opencracia.

## License

Opencracia is open source software unther the GPL v3.0 license.