This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm ci
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy server

Before starting deploying the server for the project, we encourage you to update libraries and dependencies.

```bash
sudo apt-get install -y nginx
sudo apt-get update
sudo apt-get upgrade

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g

sudo apt-get install -y postgresql
pg_ctlcluster 12 main start

```

To connect the server with the GitHub repository, you need to make sure that there is `.ssh` folder and a `config` file.
```bash
mkdir ~/.ssh
chmod 700 ~/.ssh

touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

Then, you need to create a public key to sync with GitHub. Copy the content generated in the file `id_rsa.pub` and paste it in the config of the repository (https://github.com/CenterForCollectiveLearning/mon-programme-2022/settings/keys).
```bash
ssh-keygen -t rsa
cat id_rsa.pub
```

```bash
cd 
git clone git@github.com:CenterForCollectiveLearning/mon-programme-2022.git production
```

### Nginx
```bash
cd /etc/nginx/sites-available
sudo nano monprogramme2022.org
sudo ln -s /etc/nginx/sites-available/monprogramme2022.org /etc/nginx/sites-enabled/
```

In case that you receive an error from the VM. bind() to [::]:80 failed (98: Address already in use)
```bash
sudo /etc/init.d/apache2 stop
```

### Postgres

```
sudo nano /etc/postgresql/12/main/pg_hba.conf
sudo service postgresql restart
```

### CronTab
```bash
crontab -e
```

For instance, if you want to update the ranking every minute, you need to include this code:
```bash
* * * * * /path/to/file/cronjob.sh

chmod +x /path/to/file/cronjob.sh
```

Populate the database with the game options 
```python3 scripts/updateGameFile.py
```
### Deploy

```bash
npm ci
npm run build
pm2 restart all
```