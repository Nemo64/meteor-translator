# meteor-translator

A simple, lazy loading, client and server side translator for meteor.

# Quickstart (should be intuitive)

`languages/public.en_US.lang.yml`:
```YAML
user_login:
  header: login area
  labels:
    username: username
    password: password
    no_account: Create a new account!
    submit: login
```

`client/user_login.js` or any other js file:
```JavaScript
Translator.setLanguage(["en_US"]); // global language

FrontLang = new Translator(); // translator for frontend
FrontLang.use("languages/public"); // without the "en_US.lang.yml"

FrontLang.get("user_login.header"); // => login area
```

# The Translation File
This package uses [yaml files](http://www.yaml.org/) as translation files! These get compiled to json on the server side and then transmitted depending on the language and namespace so there is no unneeded loading of languages that are never used.

A typical translation file name would be `app.en_US.lang.yml`.
- The `app` is the namespace
- The `en_US` tells which locale it belongs to.
- The `lang.yml` identifies it as a language file.
 
example:

```YAML
user_login:
  title: "login area"
  label:
    username: "username"
    password: "password"
    no_account: "No account yet? Create one right now!"
    lost_password: "Did you loose your password?"
    submit: "login"
```

## How to split the files

You shouldn't use too many files as each one is another request (for the frontend at least).
I recommend that you use a schema comparable to this:
- `public.en_US.lang.yml` for everything that everyone can access
- `user.en_US.lang.yml` for content most users won't even see if they don't have an account
- `mails.en_US.lang.yml` for mails that the user won't see anyways as the server should send them

Of course this is not a must. If you have only a few strings (kb) it can safely all be one file.

# Getting the translation

## Namespaces
This package uses namespaces. Basically every file is a namespace. Out of them you create `Translator` instances.
```JavaScript
Translator.setLanguage(["en_US"]); // global language

FrontLang = new Translator();
FrontLang.use("languages/public");
// now every key of languages/public.en_US.lang.yml
// can be accessed with FrontLang.get("key");

MyPackageLang = new Translator();
MyPackageLang.use("packages/my-package/lang");
// this can be used if you want to use this translator
// for a meteor package. Other scenarios include mails etc.
```

## Choosing a Language
### Global
Most of the time your application uses (at least in the frontend) one language.
That's why there is a global Language for everything!
```JavaScript
Translator.setLanguage(["en_US"]); // initial set
// ... 
// user selects new language
Translator.setLanguage(["cs_CZ"]);
// this reactively changes all translations
```

### Local
But that might be to limiting (especially on the server side) so you can overwrite it for a translator.
```JavaScript
FrontLang = new Translator();
FrontLang.use("languages/public");

// per translator
FrontLang.setLanguage(["de_DE"]);
FrontLang.get("hello"); // => Hallo
```

# TODO
- Parameters are not yet available, the plan is `FrontLang.get("key", { username: "You" }) // "hey %username%" => "hey You"`
- a template helper
- autodetect of languages (by far not final at branch `feature-autodetect`)
- pluralization
- territory fallback
- providing of features from [CLDR](http://cldr.unicode.org/) like number formatting and dates
