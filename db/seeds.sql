INSERT INTO departments (id, name)
VALUES (01, "Service"),
       (02, "Sales"),
       (03, "Engineering");

INSERT INTO role (id, title, salary, departments_id)
VALUES (01, "Customer Service", 80000, 01),
       (02, "Sales Represenative", 100000, 02),
       (03, "Civil Engineer", 130000,  03);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (01, "Wesley", "Clements", 01, NULL),
        (02, "Andrew", "Lovato", 02, 01),
        (03, "Rodger", "Flint", 03, 01);

       