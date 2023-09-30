# Josephshams.github.io

#### **Important**: Since this site is public the first thing to do is to protect the site, i.e. only you as the owner can update the content.

#### To run the work locally for development

- `git clone https://github.com/JosephYShams/Josephshams.github.io.git`
- Using VS to edit your code
- Test the site using `docker run -p 80:80 -v ${pwd}:/usr/share/nginx/html nginx` from windows OS   
- Or `docker run -p 80:80 -v $(pwd):/usr/share/nginx/html nginx` from Linux OS

#### Run the docker command from the root of your site.

If you want to know what needs to be done to get your static site hosted on GitHub watch these two videos:

- The video on How to Host a Website On Github - https://youtu.be/8hrJ4oN1u_8
- How To add a Custom Domain On Github Pages - https://youtu.be/mPGi1IHQxFM

# 

- GitHub will give you SSH for free so you don't need to configure anything.
- Any code commited to the main branch is automatically aviable to your users.
- Sometimes **it can take a few minutes for updates to show** on the site. 
- The last bit is for me to add some A records to AWS Route53 (our domains registrar and DNS server).

