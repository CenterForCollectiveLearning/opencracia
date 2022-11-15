# Opencracia

Opencracia is an open-source framework that empowers communities, citizens and activists to create their own digital democracy platforms. 

The software aims to give users the ability to find their own opinion as well as the collective opinion of the alternatives provided by the creators via a series of approvals and preferences. 

Opencracia incorporates lessons from our seven previous platforms that showed promising results in expanding the understanding of collective preferences. In addition, we included methods taken from social choice theory, the formal study of collective decision-making, into the framework. 

The interface of Opencracia is built for accessibility, flexibility and a mobile-friendly experience.

## Getting started

Set up Opencracia by cloning the template:
```
git clone https://github.com/CenterForCollectiveLearning/opencracia.git
```
### Set Up Parameters and Environment

After you clone the template, you need to config two files before to start. The file `opencracia.config.json` includes the settings to run and deploy your platform.
```
{
  "title": "Opencracia",
  "languages": ["en", "es"],
  "module": "approval",
  "alternatives": "CSV_FILE_URL",
  "ballotSize": 5,
  "RECAPTCHA_KEY": "",
  "translations": "TSV_FILE_URL"
}
```

Next, you need to set up the environment variables in order to connect the platform with your database. For this, you need to define three env variables: Database connection, reCaptcha and a secret key to encrypt the IP address.

```
export DATABASE_URL=postgresql://my_user:my_password@localhost:5432/my_db
export RECAPTCHA_SECRET_KEY_V3="RECAPTCHA_SECRET_KEY"
export SECRET_KEY="ny_secret_key"
```

The main difference between those files is that as long as `opencracia.config.json` includes public variables that can be stored in a repository, `.env` file includes private values that you should not share with third party.

Next, we provide more details about the `opencracia.config.json` parameters and the environment variables.

### Language support

Opencracia supports an internationalization framework (i18n). The language by default is English ("en"). However, you can either modify the default language or include multi-language support by passing an array to the `languages` parameter. 

For example, if `"languages": ["es", "en"]`, it means that the platform is in Spanish and English, and the default language is Spanish.

Once you set the languages, the files inside the folder `"locales/{lang}"` (lang = "es" | "en") are used to create all the elements' labels. You can change the path of this folder using the variable `"translations"` on `opencracia.config.json`. In order to create these files, you can create a .tsv file that will be read to populate the elements' labels on the following format:

|       key        |        en        |        es        |        pt        |
|   ------------   |   ------------   |   ------------   |   ------------   |
|   website.name   |    Opencracia    |    Opencracia    |    Opencracia    |
|   menu.results   |    Results       |    Resultados    |    Resultados    |


Either you add or edit the file inside the folder `"public/data/opencracia_elements.tsv"`
or you can connect to a Google Sheets file (on the Google Sheets file, click on: `File -> Share -> Publish to web -> Publish as .tsv -> use this link`). 

The file inside the folder `"public/data/opencracia_elements.tsv"` has the template that you have to follow. If you change, any key name in this file, you will have to change the name of element in the code. Therefore, take care while changing the key names.

Finally, you have to set the path on the variable `TSV_FILE_URL` for the .tsv file on the `opencracia.config.json`. 


### Proposals

Teams involved in the deployment of an instance should prepare a CSV file with a set of alternatives to ask users. Each column represents the alternatives in a different language. Also, the file must including an `id` column.

For example, you want to deploy a platform in English, Spanish and Portuguese, and asking 3 propositions, the parameter should be `"languages": ["en", "es", "pt"]`, and the CSV file should look like:

| id | en | es | pt |
| - | - | - | - |
| 1 | Create a new constitution | Crear una nueva constitucion | Criar uma nova constituição |
| 2 | Legalization of cannabis | Legalizacion de la marihuana | Legalizar a maconha |

Additionally, the parameter `alternatives` is the url of the CSV file. 

### Modules

Currently, `opencracia.config.json` supports four participation modules: 

- `pairwise`  : Pairwise Comparison
- `approval`  : Approval Voting
- `rank`      : Ranking Voting
- `fallback`  : Fallback Voting

Also, we include a parameter called `ballotSize` in order to divide the number of propositions contained per panel in `approval`, `ranking`, and `fallback` modules. For example, whether `ballotSize = 5` and there are 50 alternatives, the platform will split into ten panels of 5 alternatives each.

### Database

So far, Opencracia is built to store data on PostgreSQL. To initialize the tables, the file [tables.sql](tables.sql) includes the tables to include in your database.

For running the script, make sure that the env var `DATABASE_URL` is configured and follows the connection string `postgresql://my_user:my_password@localhost:5432/my_db`.

Then, from the project folder, run on the Terminal the following script:

```
node scripts/db.js createTables
```

The `db.js` file creates in your database the tables you need to store data. 



## Running a Hello World

Now that you already config the `opencracia.config.json` file, included your env vars, create the tables in the database, you are ready to start!

First, you need to install de node dependencies:

```
npm ci
```

Then, you are ready to deploy on local:
```
npm run dev
```



## Platforms inspired by Opencracia

- [Mon Programme 2022](https://monprogramme2022.org): A digital tool to create a government program for the 2022 French Presidential Election.

- [Brazucracia](https://brazucracia.org): A digital tool to create a government program for the 2022 Brazilian Presidential Election.

## Contributing

We encourage developers and hack-activists to send their Pull Requests to Opencracia.

## License

Opencracia is open source software unther the GPL v3.0 license.