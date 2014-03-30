# meteor-translator

A simple, lazy loading, client and server side translator for meteor.

# Basic usage

## The Translation File
This package uses [yaml files](http://www.yaml.org/) as translation files! These get compiled to json on the server side and then transmitted depending on the language and namespace so there is no unneeded loading of languages that are never used.

A typical translation file name would be `app.en_US.lang.yml`.
- The `app` is the namespace
- The `en_US` tells which locale it belongs to.
- The `lang.yml` identifies it as a language file.
 
Lets see how the file could look like:

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

## Getting the translation

```Javascript
Translator.setLanguage(["en_US"]); // set the global language. Multiple languages are possible for fallbacks
FrontLang = new Translator(); // create one for each purpose, in this case the frontend
FrontLang.use("path/to/namespace"); // the langauge file without the language eg. "app", not "app.en_US.lang.yml"

Template.login.title = function () {
  return FrontLang.get("user_login.title"); // -> login area
}
```

And there you have your translation!

### Namespaces `#use("namespace")`

A Namespace is basically a single file which can be `use`d by the translator.
`#use("languages/public")` will load and prepare `languages/public.en_US.lang.yml`.

You can use multiple namespaces in one translator. But they could conflict if 2 namespaces have the same keys.
You should try splitting your namespaces like this:
- `public.en_US.lang.yml` for everything that everyone can access
- `user.en_US.lang.yml` for content most users won't even see if they don't have an account
- `mails.en_US.lang.yml` for mails that the user won't see anyways as the server should send them

and so on... 

You shouldn't use too many namespaces because it would require more requests.
Let's say a user has now logged in. You can simply use `FrontLang.use("user")` anytime to add a namespace which is only then loaded.

### Languages `#setLanguage(["en_US"])` / `#getLanguage()`

This package uses a global language for every translator. You can change it at any time.
```Javascript
Translator.setLanguage(["de_DE", "en_US"]); // reactively change the language to de with en fallback
```

It is also possible to overwrite the global language for one translator.
```Javascript
FrontLang.setLanguage(["de_DE", "en_US"]);
// now only FrontLang will use those languages
```

# TODO
- Parameters are not yet available, the plan is `FrontLang.get("key", { username: "You" }) // "hey %username%" => "hey You"`
- a template helper
- autodetect of languages (by far not final at branch `feature-autodetect`)
- pluralisation
- territory fallback
- providing of features from [CLDR](http://cldr.unicode.org/) like Number Formating and Dates
