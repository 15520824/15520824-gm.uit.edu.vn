insert into real.contact_link(userid, typecontact, houseid, contactid, note)
select p.user_id, IFNULL(p.type, 0), p.product_id, c.id, '' 
from admin_pizo.lck_product_contact_info as p, realcontact_link.contacts as c
where p.phone = c.phone;