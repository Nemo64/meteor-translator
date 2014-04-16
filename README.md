# translator - powerful internationalization
This package covers you with everything language related... because it's annoying!

It's features are:
- readable **[yaml files](http://www.yaml.org/)** to store the translations
- **namespacing** though multiple files
- **parameters** in the translation (`hello {{username}}`)
- language **fallbacks**
- **lazy loading** of languages as soon as they are needed
- **automatic language detection** using the `accept-language` header (experimental)
- **reactive changing** of the translations

## Content
- [Quickstart](#quickstart-should-be-intuitive)
- [The Translation File](#the-translation-file)
- [Namespaces](#namespaces)
- [Language selection](#language-selection)
- [Templates](#templates)
- [Parameter](#parameter)
- [TODO](#todo)

## Quickstart (should be intuitive)

### Translation file
`languages/user.en_US.lang.yml`
```YAML
user_area:
  header: "user area"
  message:
    greeting: "Hello {{name}}!"
```

### JavaScript
```JavaScript
FrontLang = new Translator(); // translator for frontend
FrontLang.use('languages/user'); // without the "en_US.lang.yml"

FrontLang.get('user_area.header'); // => user area
FrontLang.get('user_area.message.greeting', { name: "world" }); // => Hello world!
// the language was automatically guessed
```

### Template
```Javascript
// this JavaScript is required to ensure capsulation
Template.template_name.trans = FrontLang.createHelper();
```
```HTML
<template name="template_name">
    <h1>{{trans "user_area"}}</h1>
    <p>{{trans "user_area.message.greeting" name="world"}}</p>
</template>
```

## The Translation File
This package uses [yaml files](http://www.yaml.org/) as translation files! These get compiled to json on the server side and then transmitted depending on the language and namespace so there is no unneeded loading of languages that are never used.

A typical translation file name would be `public.en_US.lang.yml`.
- The `public` is the namespace
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
  errors:
    wrong_login: "Login into {{account}} failed!"
    enter_username: "please enter a username"
    enter_password: "please enter a password"
```

### How to split the files
You shouldn't use too many files as each one is another request (for the frontend at least).
I recommend that you use a schema comparable to this:
- `public.en_US.lang.yml` for everything that everyone can access
- `user.en_US.lang.yml` for content most users won't even see if they don't have an account
- `mails.en_US.lang.yml` for mails that the user won't see anyways as the server should send them

Of course this is not a must. If you have only a few strings (kb) it can safely all be one file.

## Namespaces
This package uses namespaces. Basically every file is a namespace. Out of them you create `Translator` instances.
```JavaScript
Translator.setLanguage(["en_US"]); // global language

FrontLang = new Translator();
FrontLang.use("languages/public");
// now every key of languages/public.en_US.lang.yml
// can be accessed with FrontLang.get("key");

MailerLang = new Translator();
MailerLang.use("languages/user_mail");
MailerLang.use("languages/admin_mail");
MailerLang.use("languages/status_mail");
// the mailer translator will now look into 3 namespaces
// there priority is from the first to the last (might change)

MyPackageLang = new Translator();
MyPackageLang.use("packages/my-package/lang");
// this can be used if you want to use this translator
// for a meteor package. Other scenarios include mails etc.
```

## Language selection
### Autodetect
This package tries to automatically guess the language of the user using the `accept-language` header but you should always include a way for the user to change it! Also you should define a default language which will be used if none of the languages the browser offers exist.
```JavaScript
Translator.setDefaultLanguage(['en_US', 'en']);
```
- **Warning** If you do not define a global language or a default language your user might have no language at all and see the translation keys which you definetly want to prevent from happening!
- **Note** The default language is currently only used for the autodetection! It won't have any effect if you set a language like below!

### Global
Most of the time your application uses (at least in the frontend) one language.
That's why there is a global language for all translator instances!
```JavaScript
// still using the automatically detected language (en_US)
FrontLang.get('hello'); // hello!
// ... 
// user selects new language
Translator.setLanguage(["de_DE"]);
// this reactively changes all translations
FrontLang.get('hello'); // Hallo!
```

### Local
But that might be to limiting (especially on the server side) so you can overwrite it for a translator.
```JavaScript
FrontLang = new Translator();
FrontLang.use("languages/public");

// per translator
FrontLang.setLanguage(["de_DE"]);
FrontLang.get("hello"); // => Hallo!
```

## Templates
Because of the namespaces there is no global translation helper. However there is a helper to create a helper. ;)
```JavaScript
FrontLang = new Translator();
FrontLang.use("languages/public");

// and now the helper
Template.template_name.trans = FrontLang.createHelper();
```
That should be easy enough and keeps the capsulation. Also it prevents a collision with other i18n packages.
If you desire you can still create a global helper with `UI.registerHelper("trans", FrontLang.createHelper())`.

The use in the template is then as you'd expect it:
```HTML
<template name="template_name">
  <h1>{{trans "user_login.header"}}</h1>
</template>
```

## Parameter
Sometimes parts can't be translated because they are dynamic. For this case there are parameters. Want to greet your users?
```YAML
greeting: "Hello {{name}}!"
long_time_notice: "It has been {{days}} days!"
```
Then you can pass these parameters to the get method or a template.
```JavaScript
FrontLang.get('greeting', { name: user.name });
FrontLang.get('long_time_notice', { days: user.daysSinceLogin() });
```
```HTML
<p>{{trans 'greeting' name=user.name}}<p>
<p>{{trans 'greeting' name="Mustermann"}}<p>
```
## TODO
- pluralization
- ~~remembering of the language when set globally~~ (not the job of this package)
- territory fallback
- providing of features from [CLDR](http://cldr.unicode.org/) like number formatting and dates
