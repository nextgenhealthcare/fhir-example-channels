CREATE TABLE resource_sequence
(
  id BIGINT NOT NULL
);

INSERT INTO resource_sequence VALUES (1);

CREATE TABLE resource
(
  sequence_id BIGINT NOT NULL,
  name NVARCHAR(255) NOT NULL,
  id NVARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  data XML,
  mimetype NVARCHAR(255),
  last_modified DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP,
  deleted BIT,
  request_method NVARCHAR(MAX),
  request_url NVARCHAR(MAX),
  CONSTRAINT resource_pkey PRIMARY KEY (sequence_id),
  CONSTRAINT resource_unq UNIQUE (name, id, version)
);