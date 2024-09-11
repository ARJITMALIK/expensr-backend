## how to set up jatt da backend

- npm i
- fill the .env file with the contents in the table below
- npm run dev
- andddd jatt da server is up live and running, make a really great backend buddy, make it worth
- just please delete this readme from your polished new project

## env file contents

| **Variable** | **Content** |
| :--- | :--- |
| SERVER_PORT | anything goes |
| SQL_DB_HOST_IP | 127.0.0.1 |
| SQL_DB_PORT | 3306 |
| SQL_DB_NAME | some really saucy db name |
| SQL_DB_USER | jatt ( has to be this ) |
| SQL_DB_PASSWORD | yourStashLocation |
| SQL_DB_CONN_RETRY_COUNT | 120 |
| SQL_DB_CONN_COUNT | 5 |
| STAGING_AUTHENTICATE_DB | userDB |
| SECRET_KEY | jackBhiJaatTha |
| ENVIRONMENT | development ( please just do this for the logger's sake ) |

## Alright fine!! lemme make this more easy for you, here

```
SERVER_PORT=5000

SQL_DB_HOST_IP=127.0.0.1
SQL_DB_PORT=3306
SQL_DB_NAME=jattDaDb
SQL_DB_USER=jatt
SQL_DB_PASSWORD=jatt@123
SQL_DB_CONN_RETRY_COUNT=120
SQL_DB_CONN_COUNT=5
STAGING_AUTHENTICATE_DB=userDB
SECRET_KEY=jackBhiJaatTha

ENVIRONMENT = development
```
