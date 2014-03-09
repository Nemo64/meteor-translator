# meteor-translator

a simple, lazy loading, client and server side translator for meteor

**This project is not done yet. As soon as I think it's ready I'll make a atmosphere entry.**

# Basic usage

## The Translation File
This package uses [yaml](http://www.yaml.org/) files as translation files! These get compiled to json on the server side and then transmitted depending on the language and namespace so there is no unneeded loading of languages that are never used.

A typical translation file name would be `app.en_US.lang.yml`.
- The `app` is the namespace
- The `en_US` tells which locale it belongs to.
- The `lang.yml` identifies it as a language file.
 
Lets see how the file could look like:

```YAML
user_login:
  title: "Login area"
  label:
    username: "username"
    password: "password"
    no_account: "No account yet? Create one right now!"
    lost_password: "Did you loose your password?"
    submit: "login"
```

Easy right? But now how to get the translation

## Getting my translation

```Javascript
FrontLang = new Translator(["en_US"]); // multiple languages are possible as fallback
FrontLang.use("path/to/namespace"); // the langauge file without the language eg "app", not "app.en_US.lang.yml"

Template.login.title = function () {
  return FrontLang.get("user_login.title");
}
```

And there you have you Translation! You should create multiple translators for different contexts like `MailLang` etc.
In this case our translations will be used for the frontend so it's name is `FrontLang` (Frontend Language)

The `FrontLang.use()` lets you say which translation namespaces to use.
You can use multiple but every namespace is another request so do not use too many.
It could also conflict if 2 namespaces have the same keys.
You should try splitting your namespaces like this:
- `public.en_US.lang.yml` for everything that everyone can access
- `user.en_US.lang.yml` for content most users won't even see if they don't have an account
- `mails.en_US.lang.yml` for mails that the user won't see anyways as the server should send them

and so on... Let's say a user has now logged in. You can simply use `FrontLang.use("lang/user")` anytime to add namespaces.

You can also change the language during runtime (eg. if the user selects one).
```Javascript
FrontLang.setLanguage(["de_DE", "en_US"]); // reactively change the language
```
And that concludes it for now ;) There are more features to come so be patient!

### TODO
- This does not work on the server side yet because [i can't access the json from there](https://github.com/meteor/meteor/issues/1906)
- Parameters are not yet available, the plan is `FrontLang.get("key", { username: "username" }`
