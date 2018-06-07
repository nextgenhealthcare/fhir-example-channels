CREATE SEQUENCE resource_sequence
  INCREMENT 1
  START 1;
 
CREATE TABLE resource
(
  sequence_id bigint NOT NULL DEFAULT nextval('resource_sequence'::regclass),
  name character varying(255) NOT NULL,
  id character varying(255) NOT NULL,
  version integer NOT NULL,
  data xml,
  mimetype character varying(255),
  last_modified timestamp with time zone DEFAULT now(),
  deleted boolean,
  request_method character varying,
  request_url character varying,
  CONSTRAINT resource_pkey PRIMARY KEY (sequence_id),
  CONSTRAINT resource_unq UNIQUE (name, id, version)
);