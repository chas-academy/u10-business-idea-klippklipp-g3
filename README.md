# Group policy and work ethics

All group members are expected to attend stand-ups (as of now, Mondays @ 1 PM) and other meetings assigned by the group as a whole.

This being said we are all people with personal lives and unexpected things can happen. If for whatever reason any team member can not attend a meeting or is in risk of missing a deadline it is important that you take personal responsibility and contact the group in the designated slack group channel.

Other than that, happy hacking 🤩

# Stacks

**Frontend:** [ReactJS](https://reactjs.org)

**Backend:** [NodeJS](https://nodejs.org/en/)

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

Additionally, we want to follow popular/common practices and conventions. Sources to those highlighted below are [PHP_FIG - PSR-1](https://www.php-fig.org/psr/psr-1/) and [Laravel Best Practices (Repo)](https://github.com/alexeymezenin/laravel-best-practices#follow-laravel-naming-conventions).

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
code --install-extension HookyQR.beautify
code --install-extension esbenp.prettier-vscode
```
