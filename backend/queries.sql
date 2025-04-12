-- Create Users Table
create table users (
   id         serial primary key,
   email      varchar(255) unique not null,
   password   varchar(255) not null,
   created_at timestamp default current_timestamp
);

-- Create Tasks Table
create table tasks (
   id          serial primary key,
   title       varchar(255) not null,
   description text,
   created_by  int
      references users ( id )
         on delete cascade,
   created_at  timestamp default current_timestamp
);

-- Create Shared Tasks Table
create table shared_tasks (
   task_id int
      references tasks ( id )
         on delete cascade,
   user_id int
      references users ( id )
         on delete cascade,
   primary key ( task_id,
                 user_id )
);