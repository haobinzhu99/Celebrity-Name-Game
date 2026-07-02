--
-- PostgreSQL database dump
--

\restrict B4HiomdLmb1VgeWDtHzdUxunNY8f14M8wFPtznh6ooDhbWqHE5w5OYgrg4xw2aD

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg22.04+1)
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-02 11:11:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16532)
-- Name: Answer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Answer" (
    id integer NOT NULL,
    username text,
    celebrity text
);


ALTER TABLE public."Answer" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16540)
-- Name: Game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Game" (
    id integer NOT NULL,
    "roomCode" text,
    answers text
);


ALTER TABLE public."Game" OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 16532)
-- Dependencies: 219
-- Data for Name: Answer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Answer" (id, username, celebrity) FROM stdin;
\.


--
-- TOC entry 3359 (class 0 OID 16540)
-- Dependencies: 220
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Game" (id, "roomCode", answers) FROM stdin;
\.


--
-- TOC entry 3208 (class 2606 OID 16539)
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY (id);


--
-- TOC entry 3210 (class 2606 OID 16547)
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


-- Completed on 2026-07-02 11:11:19

--
-- PostgreSQL database dump complete
--

\unrestrict B4HiomdLmb1VgeWDtHzdUxunNY8f14M8wFPtznh6ooDhbWqHE5w5OYgrg4xw2aD

