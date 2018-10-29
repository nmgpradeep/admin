module.exports = {
	'PUBLIC_URL':'http://localhost:3006/',
    'PER_PAGE_RECORD': 10,
    'SMTP_HOST':'smtp.sendgrid.net',
    'SMTP_PORT': 587,
    'SMTP_USERNAME': 'shivram.nmg',
    'SMTP_PASSWORD': 'NMG_2015',
    'SMTP_FROM_EMAIL': 'rajiv.kumar@newmediaguru.net',
    'profileimage_path':'/var/www/html/node_admin/public/assets/uploads/ProfilePic/',
    'cmsimage_path':'/var/www/html/node_admin/public/assets/uploads/cmsPageImage/',
    'donationimage_path':'/var/www/html/node_admin/public/assets/uploads/donationImage/',
    'product_path': '/var/www/html/node_admin/public/assets/uploads/Products/',
    'advertisementimage_path': '/var/www/html/node_admin/public/assets/uploads/AdvertisementImage/',
    'notification_type':[{'id':'1','name':'New User Created'},{'id':'2','name':'New Trade Requested'},{'id':'3','name':'Trade Rejected'},{'id':'4','name':'New Message Received'}],
    'donation_conditions':[{'id':'1','name':'New'},{'id':'2','name':'old'},{'id':'3','name':'Excellent'},{'id':'4','name':'Very Old'}],
    'donation_status':[{'id':'0','name':'Pending'},{'id':'1','name':'Accepted'},{'id':'2','name':'Rejected'}],
    'shippingStatus':[{'id':'0','name':'Picked up'},{'id':'1','name':'Shipped'},{'id':'2','name':'Delivered'}],
    'returnReason':[{'id':'0','name':'Item Defective'},{'id':'1','name':'Bought By Mistake'},{'id':'2','name':'No longer needed'},{'id':'3','name':'Too small'},{'id':'4','name':'Ordered In wrong size'},{'id':'5','name':'Product not as expected'}]
};
