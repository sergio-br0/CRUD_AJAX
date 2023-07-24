create table productos(
    producto_id serial not null,
    producto_nombre varchar(50) not null,
    producto_precio decimal(10,2) not null,
    producto_situacion smallint not null default 1,
    primary key (producto_id)
);

create table clientes(
    cliente_id SERIAL not null,
    cliente_nombre VARCHAR(50) not null,
    cliente_nit VARCHAR(50) not null,
    cliente_situacion char (1) DEFAULT '1',
    primary key (cliente_id)
)