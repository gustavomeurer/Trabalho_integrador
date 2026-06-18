--
-- PostgreSQL database dump
--

\restrict Ar2vxHe4kFhfBxmQTua6J4BrA8Rq3aDy2SluLEc6Z0LGjLIOPpAXBH8dGpV7Lcm

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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
-- Name: fn_definir_prioridade_triagem(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_definir_prioridade_triagem() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_classificacao INTEGER;
BEGIN
    IF LOWER(NEW.gravidade_sintomas) = 'critica'
       OR LOWER(NEW.gravidade_sintomas) = 'crítica'
       OR NEW.temperatura >= 40
       OR NEW.frequencia_cardiaca >= 180 THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE prioridade = 1
        LIMIT 1;

    ELSIF LOWER(NEW.gravidade_sintomas) = 'grave'
       OR NEW.temperatura >= 39
       OR NEW.frequencia_cardiaca >= 130 THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE prioridade = 2
        LIMIT 1;

    ELSIF LOWER(NEW.gravidade_sintomas) = 'moderada'
       OR NEW.temperatura >= 38
       OR NEW.frequencia_cardiaca >= 110 THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE prioridade = 3
        LIMIT 1;

    ELSIF LOWER(NEW.gravidade_sintomas) = 'leve' THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE prioridade = 4
        LIMIT 1;

    ELSE
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE prioridade = 5
        LIMIT 1;
    END IF;

    NEW.id_classificacao = v_id_classificacao;
    NEW.data_atualizacao = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_definir_prioridade_triagem() OWNER TO postgres;

--
-- Name: fn_log_triagem(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_log_triagem() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN

        INSERT INTO log_triagem (
            id_triagem,
            acao,
            descricao
        )
        VALUES (
            NEW.id_triagem,
            'INSERT',
            'Triagem registrada no sistema'
        );

    ELSIF TG_OP = 'UPDATE' THEN

        INSERT INTO log_triagem (
            id_triagem,
            acao,
            descricao
        )
        VALUES (
            NEW.id_triagem,
            'UPDATE',
            'Triagem atualizada no sistema'
        );

    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_log_triagem() OWNER TO postgres;

--
-- Name: sp_registrar_triagem(integer, text, numeric, integer, character varying, text); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_integracao integer, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas character varying, IN p_observacoes text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO triagem (
        id_consulta_integracao,
        sintomas_relatados,
        temperatura,
        frequencia_cardiaca,
        gravidade_sintomas,
        observacoes,
        status_triagem,
        data_triagem,
        data_atualizacao
    )
    VALUES (
        p_id_consulta_integracao,
        p_sintomas_relatados,
        p_temperatura,
        p_frequencia_cardiaca,
        p_gravidade_sintomas,
        p_observacoes,
        'registrada',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
END;
$$;


ALTER PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_integracao integer, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas character varying, IN p_observacoes text) OWNER TO postgres;

--
-- Name: sp_registrar_triagem(integer, character varying, character varying, text, numeric, integer, text); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_externa integer, IN p_nome_paciente character varying, IN p_documento_paciente character varying, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_consulta_integracao INTEGER;
    v_id_classificacao INTEGER;
BEGIN

    -- ========================================================
    -- 1. Insere ou atualiza a consulta recebida do G4
    -- ========================================================

    INSERT INTO consulta_integracao (
        id_consulta_externa,
        nome_paciente,
        documento_paciente,
        data_consulta,
        status_consulta,
        data_atualizacao
    )
    VALUES (
        p_id_consulta_externa,
        p_nome_paciente,
        p_documento_paciente,
        CURRENT_TIMESTAMP,
        'recebida_api',
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (id_consulta_externa)
    DO UPDATE SET
        nome_paciente = EXCLUDED.nome_paciente,
        documento_paciente = EXCLUDED.documento_paciente,
        data_atualizacao = CURRENT_TIMESTAMP
    RETURNING id_consulta_integracao
    INTO v_id_consulta_integracao;


    -- ========================================================
    -- 2. Classificação automática de risco
    -- ========================================================

    IF p_frequencia_cardiaca >= 130
        OR p_temperatura >= 40.0
        OR p_gravidade_sintomas = 'muito_grave' THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE nivel = 'vermelho';

    ELSIF p_frequencia_cardiaca BETWEEN 110 AND 129
        OR p_temperatura BETWEEN 38.5 AND 39.9
        OR p_gravidade_sintomas = 'grave' THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE nivel = 'laranja';

    ELSIF p_frequencia_cardiaca BETWEEN 100 AND 109
        OR p_temperatura BETWEEN 37.8 AND 38.4
        OR p_gravidade_sintomas = 'moderada' THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE nivel = 'amarelo';

    ELSIF p_sintomas_relatados ILIKE '%dor%'
        OR p_sintomas_relatados ILIKE '%febre%'
        OR p_sintomas_relatados ILIKE '%tontura%'
        OR p_gravidade_sintomas = 'leve' THEN

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE nivel = 'verde';

    ELSE

        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE nivel = 'azul';

    END IF;


    -- ========================================================
    -- 3. Registra a triagem
    -- ========================================================

    INSERT INTO triagem (
        id_consulta_integracao,
        id_classificacao,
        sintomas_relatados,
        temperatura,
        frequencia_cardiaca,
        gravidade_sintomas,
        status_triagem
    )
    VALUES (
        v_id_consulta_integracao,
        v_id_classificacao,
        p_sintomas_relatados,
        p_temperatura,
        p_frequencia_cardiaca,
        p_gravidade_sintomas,
        'registrada'
    );

END;
$$;


ALTER PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_externa integer, IN p_nome_paciente character varying, IN p_documento_paciente character varying, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas text) OWNER TO postgres;

--
-- Name: sp_registrar_triagem(character varying, character varying, character varying, text, numeric, integer, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_externa character varying, IN p_nome_paciente character varying, IN p_documento_paciente character varying, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_consulta_integracao INTEGER;
    v_id_classificacao INTEGER;
BEGIN
    SELECT id_consulta_integracao
    INTO v_id_consulta_integracao
    FROM consulta_integracao
    WHERE id_consulta_externa = p_id_consulta_externa;

    IF v_id_consulta_integracao IS NULL THEN
        INSERT INTO consulta_integracao (
            id_consulta_externa,
            nome_paciente,
            documento_paciente,
            data_consulta,
            status_consulta,
            data_importacao,
            data_atualizacao
        )
        VALUES (
            p_id_consulta_externa,
            p_nome_paciente,
            p_documento_paciente,
            NOW(),
            'agendada',
            NOW(),
            NOW()
        )
        RETURNING id_consulta_integracao INTO v_id_consulta_integracao;
    END IF;

    IF LOWER(p_gravidade_sintomas) = 'critica' THEN
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE LOWER(nivel) = 'vermelho';

    ELSIF LOWER(p_gravidade_sintomas) = 'grave'
       OR p_temperatura >= 39
       OR p_frequencia_cardiaca >= 120 THEN
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE LOWER(nivel) = 'laranja';

    ELSIF LOWER(p_gravidade_sintomas) = 'moderada'
       OR p_temperatura >= 38
       OR p_frequencia_cardiaca >= 100 THEN
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE LOWER(nivel) = 'amarelo';

    ELSIF LOWER(p_gravidade_sintomas) = 'leve' THEN
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE LOWER(nivel) = 'verde';

    ELSE
        SELECT id_classificacao
        INTO v_id_classificacao
        FROM classificacao_risco
        WHERE LOWER(nivel) = 'azul';
    END IF;

    INSERT INTO triagem (
        id_consulta_integracao,
        id_classificacao,
        sintomas_relatados,
        temperatura,
        frequencia_cardiaca,
        gravidade_sintomas,
        observacoes,
        status_triagem,
        data_triagem,
        data_atualizacao
    )
    VALUES (
        v_id_consulta_integracao,
        v_id_classificacao,
        p_sintomas_relatados,
        p_temperatura,
        p_frequencia_cardiaca,
        LOWER(p_gravidade_sintomas),
        NULL,
        'registrada',
        NOW(),
        NOW()
    );
END;
$$;


ALTER PROCEDURE public.sp_registrar_triagem(IN p_id_consulta_externa character varying, IN p_nome_paciente character varying, IN p_documento_paciente character varying, IN p_sintomas_relatados text, IN p_temperatura numeric, IN p_frequencia_cardiaca integer, IN p_gravidade_sintomas character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: classificacao_risco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classificacao_risco (
    id_classificacao integer NOT NULL,
    nivel character varying(30) NOT NULL,
    descricao character varying(150) NOT NULL,
    prioridade integer NOT NULL,
    CONSTRAINT chk_prioridade_classificacao CHECK (((prioridade >= 1) AND (prioridade <= 5)))
);


ALTER TABLE public.classificacao_risco OWNER TO postgres;

--
-- Name: classificacao_risco_id_classificacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classificacao_risco_id_classificacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classificacao_risco_id_classificacao_seq OWNER TO postgres;

--
-- Name: classificacao_risco_id_classificacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classificacao_risco_id_classificacao_seq OWNED BY public.classificacao_risco.id_classificacao;


--
-- Name: consulta_integracao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consulta_integracao (
    id_consulta_integracao integer NOT NULL,
    id_consulta_externa character varying(100) NOT NULL,
    nome_paciente character varying(100) NOT NULL,
    documento_paciente character varying(20),
    data_consulta timestamp without time zone NOT NULL,
    status_consulta character varying(40),
    data_importacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_atualizacao timestamp without time zone
);


ALTER TABLE public.consulta_integracao OWNER TO postgres;

--
-- Name: consulta_integracao_id_consulta_integracao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consulta_integracao_id_consulta_integracao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consulta_integracao_id_consulta_integracao_seq OWNER TO postgres;

--
-- Name: consulta_integracao_id_consulta_integracao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consulta_integracao_id_consulta_integracao_seq OWNED BY public.consulta_integracao.id_consulta_integracao;


--
-- Name: log_triagem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_triagem (
    id_log integer NOT NULL,
    id_triagem integer NOT NULL,
    acao character varying(30) NOT NULL,
    descricao text NOT NULL,
    data_log timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.log_triagem OWNER TO postgres;

--
-- Name: log_triagem_id_log_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_triagem_id_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_triagem_id_log_seq OWNER TO postgres;

--
-- Name: log_triagem_id_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_triagem_id_log_seq OWNED BY public.log_triagem.id_log;


--
-- Name: triagem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.triagem (
    id_triagem integer NOT NULL,
    id_consulta_integracao integer NOT NULL,
    id_classificacao integer,
    sintomas_relatados text NOT NULL,
    temperatura numeric(4,1),
    frequencia_cardiaca integer,
    gravidade_sintomas character varying(20) NOT NULL,
    prioridade_atendimento integer,
    observacoes text,
    status_triagem character varying(30) DEFAULT 'registrada'::character varying NOT NULL,
    data_triagem timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_atualizacao timestamp without time zone,
    CONSTRAINT chk_frequencia_cardiaca CHECK (((frequencia_cardiaca IS NULL) OR ((frequencia_cardiaca >= 30) AND (frequencia_cardiaca <= 220)))),
    CONSTRAINT chk_gravidade_sintomas CHECK (((gravidade_sintomas)::text = ANY ((ARRAY['leve'::character varying, 'moderada'::character varying, 'grave'::character varying, 'muito_grave'::character varying])::text[]))),
    CONSTRAINT chk_prioridade_atendimento CHECK (((prioridade_atendimento IS NULL) OR ((prioridade_atendimento >= 1) AND (prioridade_atendimento <= 5)))),
    CONSTRAINT chk_status_triagem CHECK (((status_triagem)::text = ANY ((ARRAY['registrada'::character varying, 'em_analise'::character varying, 'encaminhada'::character varying, 'finalizada'::character varying, 'cancelada'::character varying])::text[]))),
    CONSTRAINT chk_temperatura CHECK (((temperatura IS NULL) OR ((temperatura >= 30.0) AND (temperatura <= 45.0))))
);


ALTER TABLE public.triagem OWNER TO postgres;

--
-- Name: triagem_id_triagem_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.triagem_id_triagem_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.triagem_id_triagem_seq OWNER TO postgres;

--
-- Name: triagem_id_triagem_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.triagem_id_triagem_seq OWNED BY public.triagem.id_triagem;


--
-- Name: vw_triagens_prioridade; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_triagens_prioridade AS
 SELECT t.id_triagem,
    ci.id_consulta_integracao,
    ci.id_consulta_externa,
    ci.nome_paciente,
    ci.documento_paciente,
    ci.data_consulta,
    cr.nivel AS classificacao_risco,
    cr.descricao AS descricao_classificacao,
    cr.prioridade AS prioridade_classificacao,
    t.sintomas_relatados,
    t.temperatura,
    t.frequencia_cardiaca,
    t.gravidade_sintomas,
    t.prioridade_atendimento,
    t.observacoes,
    t.status_triagem,
    t.data_triagem
   FROM ((public.triagem t
     JOIN public.consulta_integracao ci ON ((ci.id_consulta_integracao = t.id_consulta_integracao)))
     JOIN public.classificacao_risco cr ON ((cr.id_classificacao = t.id_classificacao)))
  ORDER BY t.prioridade_atendimento, t.data_triagem;


ALTER VIEW public.vw_triagens_prioridade OWNER TO postgres;

--
-- Name: classificacao_risco id_classificacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classificacao_risco ALTER COLUMN id_classificacao SET DEFAULT nextval('public.classificacao_risco_id_classificacao_seq'::regclass);


--
-- Name: consulta_integracao id_consulta_integracao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consulta_integracao ALTER COLUMN id_consulta_integracao SET DEFAULT nextval('public.consulta_integracao_id_consulta_integracao_seq'::regclass);


--
-- Name: log_triagem id_log; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_triagem ALTER COLUMN id_log SET DEFAULT nextval('public.log_triagem_id_log_seq'::regclass);


--
-- Name: triagem id_triagem; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triagem ALTER COLUMN id_triagem SET DEFAULT nextval('public.triagem_id_triagem_seq'::regclass);


--
-- Name: classificacao_risco classificacao_risco_nivel_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classificacao_risco
    ADD CONSTRAINT classificacao_risco_nivel_key UNIQUE (nivel);


--
-- Name: classificacao_risco classificacao_risco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classificacao_risco
    ADD CONSTRAINT classificacao_risco_pkey PRIMARY KEY (id_classificacao);


--
-- Name: consulta_integracao consulta_integracao_id_consulta_externa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consulta_integracao
    ADD CONSTRAINT consulta_integracao_id_consulta_externa_key UNIQUE (id_consulta_externa);


--
-- Name: consulta_integracao consulta_integracao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consulta_integracao
    ADD CONSTRAINT consulta_integracao_pkey PRIMARY KEY (id_consulta_integracao);


--
-- Name: log_triagem log_triagem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_triagem
    ADD CONSTRAINT log_triagem_pkey PRIMARY KEY (id_log);


--
-- Name: triagem triagem_id_consulta_integracao_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triagem
    ADD CONSTRAINT triagem_id_consulta_integracao_key UNIQUE (id_consulta_integracao);


--
-- Name: triagem triagem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triagem
    ADD CONSTRAINT triagem_pkey PRIMARY KEY (id_triagem);


--
-- Name: triagem trg_definir_prioridade_triagem; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_definir_prioridade_triagem BEFORE INSERT OR UPDATE ON public.triagem FOR EACH ROW EXECUTE FUNCTION public.fn_definir_prioridade_triagem();


--
-- Name: triagem trg_log_triagem; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_triagem AFTER INSERT OR UPDATE ON public.triagem FOR EACH ROW EXECUTE FUNCTION public.fn_log_triagem();


--
-- Name: log_triagem fk_log_triagem; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_triagem
    ADD CONSTRAINT fk_log_triagem FOREIGN KEY (id_triagem) REFERENCES public.triagem(id_triagem) ON DELETE CASCADE;


--
-- Name: triagem fk_triagem_classificacao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triagem
    ADD CONSTRAINT fk_triagem_classificacao FOREIGN KEY (id_classificacao) REFERENCES public.classificacao_risco(id_classificacao);


--
-- Name: triagem fk_triagem_consulta_integracao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.triagem
    ADD CONSTRAINT fk_triagem_consulta_integracao FOREIGN KEY (id_consulta_integracao) REFERENCES public.consulta_integracao(id_consulta_integracao) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Ar2vxHe4kFhfBxmQTua6J4BrA8Rq3aDy2SluLEc6Z0LGjLIOPpAXBH8dGpV7Lcm

