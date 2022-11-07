sudo nano /etc/postgresql/12/main/pg_hba.conf
# https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge
sudo service postgresql restart

sudo su - postgres
psql 


# CREATE TABLE IF NOT EXISTS preferences(
#     id SERIAL PRIMARY KEY,
#     uuid UUID NOT NULL,
#     ip_hash VARCHAR NOT NULL,
#     option_a INT NOT NULL,
#     option_b INT NOT NULL,
#     selected INT NOT NULL,
#     datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
#     score DECIMAL NOT NULL
# );

# Increase number of connections on the server
# https://stackoverflow.com/questions/30778015/how-to-increase-the-max-connections-in-postgres 
sudo nano /etc/postgresql/12/main/postgresql.conf

# https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge
sudo nano /etc/postgresql/12/main/pg_hba.conf

CREATE ROLE user_mp WITH ENCRYPTED PASSWORD 'v#?YERrN924ec^y+';
CREATE DATABASE db_mon_programme OWNER user_mp;

GRANT ALL PRIVILEGES ON DATABASE db_mon_programme TO user_mp;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_mp;

ALTER ROLE user_mp WITH LOGIN;

\c db_mon_programme user_mp
psql -d db_mon_programme -h 127.0.0.1 -U user_mp

127.0.0.1:5432:db_mon_programme:user_mp:v#?YERrN924ec^y+

## CUSTOM
host    all             user_mp             127.0.0.1/32       md5
host    all             user_mp             ::1/128            md5

# ALTER DATABASE db_project_jd OWNER TO user_jd;

# GRANT CONNECT ON DATABASE db_project_jd TO user_jd;
# GRANT USAGE ON SCHEMA public TO user_jd;
# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_jd;
# sudo chown $USER:$USER /var/cache/mon_programme
# sudo chown -R navarrete:www-data /var/cache/mon_programme


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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game(
    id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    candidate_ids VARCHAR NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    source_link VARCHAR NOT NULL,
    source_text VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_participant(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_hash VARCHAR NOT NULL,
    game_id INT NOT NULL,
    trials VARCHAR NOT NULL,
    solved INT NOT NULL,
    level INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

# CREATE TABLE IF NOT EXISTS individual_participation(
#     id SERIAL PRIMARY KEY,
#     user_id UUID NOT NULL,
#     proposal_id INT NOT NULL,
#     voted_times INT NOT NULL,
#     appreared_times INT NOT NULL,
#     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
# );


scp navarrete@condorcet:db.sql ~./db.sql
DELETE FROM participant;
DELETE FROM rank;
DELETE FROM consent;
DELETE FROM agree;
DELETE FROM game;
DELETE FROM game_participant;

pg_dump -d db_mon_programme -h 127.0.0.1 -U user_mp -Fc -f db.sql