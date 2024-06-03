## Create the starter

Click the button below to deploy the Next.js with Supabase starter directly to Vercel. This process will also create a repository, create a Supabase project and set up all required environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This%20starter%20configures%20Supabase%20Auth%20to%20use%20cookies%2C%20making%20the%20user's%20session%20available%20throughout%20the%20entire%20Next.js%20app%20-%20Client%20Components%2C%20Server%20Components%2C%20Route%20Handlers%2C%20Server%20Actions%20and%20Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6)


## Use the code from this repository

Clone this repository and the repository that was just created. <br>
Copy over the following folders from this repository: `app`, `components`, `providers`, `public`, `utils` along with `middleware.ts`.

## Create tables in Supabase
Open the SQL Editor in your Supabase project: 
```sql
CREATE TABLE session_data (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
date DATE NOT NULL,
session_count INT NOT NULL
);
```

```sql
CREATE TABLE user_progress (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
consent_completed BOOLEAN NOT NULL,
entry_survey_completed BOOLEAN NOT NULL,
exit_survey_completed BOOLEAN NOT NULL,
days_completed INT NOT NULL
);
```

```sql
CREATE TABLE survey_responses (
response_id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
survey_type VARCHAR NOT NULL,
response_date TIMESTAMPTZ NOT NULL,
question_id VARCHAR NOT NULL,
response VARCHAR NOT NULL
);
```
Once the tables are completed it is recommend that you enable row level security and set up appropriate policies.

## Run the project
To run the project locally:
```bash
npm i
npm run dev
```
To push to Vercel you just push the changes to GitHub. 

