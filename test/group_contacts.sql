insert into real.contacts(name, phone, statusphone, userid) 
select IFNULL(name, ""), phone, status, user_id FROM admin_pizo.lck_product_contact_info group by phone;