create table usuario (
   idusuario bigserial not null,
   nome varchar(100) not null,
   matricula varchar(10) not null,
   email varchar(100) not null,
   perfil integer not null default 0,
   status integer not null default 1,
   constraint pk_usuario primary key (idusuario),
   constraint uq_matricula unique (matricula),
   constraint uq_email unique (email)	
);
insert into usuario (nome, email, matricula, perfil) values ('João', 'joao@gmail.com', '111111', 2);

create table obra (
   idobra bigserial not null,
   titulo varchar(100) not null,
   autor varchar(100) not null,
   isbn varchar(100) not null,
   editora varchar(100) not null,	
   publicacao integer not null,
   edicao varchar(10),
   categoria varchar(100) not null,	
   foto text,	
   constraint pk_obra primary key (idobra),
   constraint uq_isbn unique (isbn)	
);

INSERT INTO obra (titulo, autor, isbn, editora, publicacao, edicao, categoria, foto) VALUES
-- Programação e Engenharia de Software
('Código Limpo', 'Robert C. Martin', '9788576082675', 'Alta Books', 2009, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788576082675-L.jpg'),
('O Codificador Limpo', 'Robert C. Martin', '9788576086475', 'Alta Books', 2012, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788576086475-L.jpg'),
('Arquitetura Limpa', 'Robert C. Martin', '9788550804606', 'Alta Books', 2019, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788550804606-L.jpg'),
('Design Patterns', 'Erich Gamma et al.', '9788573076103', 'Bookman', 2000, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788573076103-L.jpg'),
('Refatoração', 'Martin Fowler', '9788575227244', 'Novatec', 2019, '2ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788575227244-L.jpg'),
('Padrões de Arquitetura de Aplicações Corporativas', 'Martin Fowler', '9788536306353', 'Bookman', 2006, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788536306353-L.jpg'),
('Entendendo Algoritmos', 'Aditya Bhargava', '9788575225639', 'Novatec', 2017, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788575225639-L.jpg'),
('Algoritmos: Teoria e Prática', 'Thomas Cormen', '9788535236996', 'Elsevier', 2012, '3ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788535236996-L.jpg'),
('A Arte de Programar Computadores - Vol 1', 'Donald Knuth', '9788577800247', 'Bookman', 2018, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788577800247-L.jpg'),
('Domain-Driven Design', 'Eric Evans', '9788576084464', 'Alta Books', 2010, '1ª', 'Programação', 'https://covers.openlibrary.org/b/isbn/9788576084464-L.jpg'),

-- Bancos de Dados
('Sistemas de Banco de Dados', 'Abraham Silberschatz', '9788535245387', 'Elsevier', 2012, '6ª', 'Banco de Dados', 'https://covers.openlibrary.org/b/isbn/9788535245387-L.jpg'),
('Projeto de Banco de Dados', 'Carlos Alberto Heuser', '9788577804528', 'Bookman', 2009, '6ª', 'Banco de Dados', 'https://covers.openlibrary.org/b/isbn/9788577804528-L.jpg'),
('SQL e Relational Theory', 'C.J. Date', '9781491911617', 'O Reilly', 2015, '3ª', 'Banco de Dados', 'https://covers.openlibrary.org/b/isbn/9781491911617-L.jpg'),
('NoSQL Distilled', 'Pramod Sadalage', '9780321826626', 'Addison-Wesley', 2012, '1ª', 'Banco de Dados', 'https://covers.openlibrary.org/b/isbn/9780321826626-L.jpg'),
('MongoDB: The Definitive Guide', 'Shannon Bradshaw', '9781491954461', 'O Reilly', 2019, '3ª', 'Banco de Dados', 'https://covers.openlibrary.org/b/isbn/9781491954461-L.jpg'),

-- Segurança
('Hacking: The Art of Exploitation', 'Jon Erickson', '9781593271442', 'No Starch Press', 2008, '2ª', 'Segurança', 'https://covers.openlibrary.org/b/isbn/9781593271442-L.jpg'),
('Cryptography and Network Security', 'William Stallings', '9780134444284', 'Pearson', 2017, '7ª', 'Segurança', 'https://covers.openlibrary.org/b/isbn/9780134444284-L.jpg'),
('The Web Application Hacker s Handbook', 'Dafydd Stuttard', '9781118026472', 'Wiley', 2011, '2ª', 'Segurança', 'https://covers.openlibrary.org/b/isbn/9781118026472-L.jpg'),

-- Redes e SO
('Redes de Computadores', 'Andrew Tanenbaum', '9788543003009', 'Pearson', 2013, '5ª', 'Redes', 'https://covers.openlibrary.org/b/isbn/9788543003009-L.jpg'),
('Sistemas Operacionais Modernos', 'Andrew Tanenbaum', '9788543005676', 'Pearson', 2015, '4ª', 'Sistemas Operacionais', 'https://covers.openlibrary.org/b/isbn/9788543005676-L.jpg'),
('How Linux Works', 'Brian Ward', '9781718500402', 'No Starch Press', 2021, '3ª', 'Sistemas Operacionais', 'https://covers.openlibrary.org/b/isbn/9781718500402-L.jpg'),

-- IA e Cloud
('Mãos à Obra: Machine Learning', 'Aurélien Géron', '9788550815480', 'Alta Books', 2021, '2ª', 'IA', 'https://covers.openlibrary.org/b/isbn/9788550815480-L.jpg'),
('Designing Data-Intensive Applications', 'Martin Kleppmann', '9781449373320', 'O Reilly', 2017, '1ª', 'Arquitetura', 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg'),
('Kubernetes in Action', 'Marko Luksa', '9781617293726', 'Manning', 2017, '1ª', 'Cloud', 'https://covers.openlibrary.org/b/isbn/9781617293726-L.jpg');


create table exemplar (
  idexemplar bigserial not null,
  idobra bigint not null,
  status integer not null default 0,
  constraint pk_exemplar primary key (idexemplar),
  constraint fk_exemplar_obra foreign key (idobra) references obra(idobra)	
);

create table emprestimo (
  idemprestimo bigserial not null,
  idexemplar bigint not null,
  idusuario bigint not null,
  emprestimo date not null default current_date,
  vencimento date not null,
  devolucao date null,	
  constraint pk_emprestimo primary key (idemprestimo),
  constraint fk_emprestimo_exemplar foreign key (idexemplar) references exemplar(idexemplar),
  constraint fk_emprestimo_usuario foreign key (idusuario) references usuario(idusuario)	
);

create table emprestimo (
  idemprestimo bigserial not null,
  idexemplar bigint not null,
  idusuario bigint not null,
  emprestimo date not null default current_date,
  vencimento date not null,
  devolucao date null,	
  constraint pk_emprestimo primary key (idemprestimo),
  constraint fk_emprestimo_exemplar foreign key (idexemplar) references exemplar(idexemplar),
  constraint fk_emprestimo_usuario foreign key (idusuario) references usuario(idusuario)	
);

