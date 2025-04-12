create table public.users
(
    id         serial
        primary key,
    email      varchar(255) not null
        unique,
    password   varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

alter table public.users
    owner to shared_to_do_production_user;

create table public.tasks
(
    id          serial
        primary key,
    title       varchar(255) not null,
    description text,
    created_by  integer
        references public.users
            on delete cascade,
    created_at  timestamp default CURRENT_TIMESTAMP
);

alter table public.tasks
    owner to shared_to_do_production_user;

create index idx_tasks_created_by
    on public.tasks (created_by);

create table public.shared_tasks
(
    task_id integer not null
        references public.tasks
            on delete cascade,
    user_id integer not null
        references public.users
            on delete cascade,
    primary key (task_id, user_id)
);

alter table public.shared_tasks
    owner to shared_to_do_production_user;

create index idx_shared_tasks_user_id
    on public.shared_tasks (user_id);

