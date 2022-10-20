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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);