# Product description

We've all been there! You toggle between hairdstylists without ever being really satisfied. Then one day, you find a stylist... a stylist that gets your unique style and makes you feel like a million bucks. Of course, eventually such a great stylist will probably move on and now your back in the rabbit hole, trying to find that one stylist that just gets you.

This is the problem we solve:

- You and your stylist(s) can keep in touch regardless of where they work
- You can rate your stylist(s) and see other peoples ratings
- You can search for stylists using location

# Group policy and work ethics

All group members are expected to attend stand-ups (as of now, Mondays @ 1 PM) and other meetings assigned by the group as a whole.

This being said we are all people with personal lives and unexpected things can happen. If for whatever reason any team member can not attend a meeting or is in risk of missing a deadline it is important that you take personal responsibility and contact the group in the designated slack group channel.

Other than that, happy hacking 🤩

# Stacks

**Frontend:**

- [ReactJS](https://reactjs.org)
- [Global state using only React Hooks with the Context API ](https://codeburst.io/global-state-with-react-hooks-and-context-api-87019cc4f2cf)

**Backend:**

- [NodeJS](https://nodejs.org/en/)

**Deployment**

- [Guide: Deploying databases](https://www.notion.so/fc4f1c0b00bf474aa8aeae2f343b4adb)

# Envirnoment and setup

We use [docker](https://www.docker.com) for a standardized and easy to follow environment setup.

## Product Backlog

Not every item on the backlog is ready to work on. An item can be place in the backlog even if it never gets used.

If a backlog item description is unclear, you can add clearification request to the author asking to clearlify the item by adding `---`, e.g:

```
Add option for user to do some stuff.

---

Which user should be able to do what?
```

## Standards and conventions

- Indentation: 2 tabs / 4 spaces

Additionally, we want to follow popular/common practices and conventions. Sources to those highlighted below are... TBA

### Casing

| Type                                  | Casing / Convention     | Example                  |
| ------------------------------------- | ----------------------- | ------------------------ |
| GitHub Branches                       | kebab-case              | add-naming-conventions   |
| Class names                           | StudlyCaps              | class TrustProxies       |
| Class constants                       | UPPERCASE_SNAKE         | $ADMIN_PASSWORD = 123;   |
| Controllers                           | StudlyCaps              | AppServiceProvider.php   |
| Models                                | StudlyCaps              | ForumThread.php          |
| Model properties                      | lower_case_snake        | $this->created_at        |
| Model methods                         | camelCase               | $this->fetchUser()       |
| Relationship (hasOne, belongsTo)      | camelCase (Singular)    | function reviewAuthor()  |
| Relationship (hasMany, belongsToMany) | camelCase (Plural)      | function reviews()       |
| Views                                 | snake_case              | all_reviews.blade.php    |
| Traits                                | Capitalized (Adjective) | Notifiable, Dispatchable |
| Database tables                       | snake_case              | movie_genres             |
| Database table columns                | snake_case              | movie_id                 |

## Setup IDE (Editor)

```bash
checklist
code --install-extension HookyQR.beautify 
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension sibiraj-s.vscode-scss-formatter
```

If you don't have ESLint installed you can add it globally on your system with `npm i -g eslint`.
