# translator - powerful internationalization
A general i18n utility belt to seperate your app from the language.

It's features are:
- readable **[yaml files](http://www.yaml.org/)** to store the translations
- **namespacing** though multiple files
- **parameters** in the translations `hello {username}`
- **[icu messageformat](http://userguide.icu-project.org/formatparse/messages)** using [cldr](http://cldr.unicode.org/) `{num, plural, one{You have one friend} other{You have # friends}}`
- **date formating** using [moment](http://momentjs.com/) and [cldr](http://cldr.unicode.org/) `released on {var, date} at {var, time}` (might be rough, [see below](#date-and-time))
- language **fallbacks** `["en_GB","en_US"]`
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
```YAML
#languages/user.en_US.lang.yml
user_area:
  header: "user area"
  message:
    greeting: "Hello {name}!"
```

### JavaScript
```JavaScript
Translator.setDefaultLanguage(['en_US']); // autodetect fallback
FrontLang = new Translator(); // translator for frontend
FrontLang.use('languages/user'); // without the "en_US.lang.yml"

FrontLang.get('user_area.header'); // => user area
FrontLang.get('user_area.message.greeting', { name: "world" }); // => Hello world!
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
    wrong_login: "Login into {account} failed!"
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
Because of the namespaces there is no global translation helper. However there is a helper to create a helper.
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
greeting: "Hello {name}!"
long_time_notice: "It has been {days} days!"
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

## Message-Format
Variations in translations (because of plural or gender) can be represented by an [ICU message-format pattern](http://userguide.icu-project.org/formatparse/messages). The implementation isn't exactly like the specs tell. This is patially because of 2 compilation steps. They get transformed to json for the transfer so the client cen very easily interpret them. If there are things easily implementable to make it more standard conform please leave an issue or contribute yourself.
### pluralization
```YAML
friend_count: >
  {friends, plural,
    0=   {You have no friends!}
    one  {You have a friend!}
    other{You have # friends!}
  }
```
There are 2 ways to tell when which variation should be used. The first is using `0=` or `1=` etc.. Those can come in handy for special cases like 0. The better way is using the cldr [plural rules](http://www.unicode.org/cldr/charts/25/supplemental/language_plural_rules.html) which automatically get compiled into the language files if needed. (the client only knows what it needs to know.) The equals variation always has a higher priority though. If no rule matches `other` will be used meaning `{var, plural, other{text}}` will always print `text`. If there is no `other` rule no text will be printed.

Any number variable and arrays can be used for the plural pattern. For arrays the length is used. If the type does not comform the `other` rule will be used.

Note the nice way you can define multiline text in yaml. The Symfony Project has a [nice documentation](http://symfony.com/doc/current/components/yaml/yaml_format.html#strings) for that.
### select
Other variations like gender can be represented by the select pattern.
```YAML
item_add: >
  {gender, select,
    female{{count, plural, one{She added one item!} other{She added # items!} }}
    male  {{count, plural, one{He added one item!}  other{He added # items!}  }}
    other {{count, plural, one{They added one item!}other{They added # items!}}}
  }
```
This example combines the select rule with the plural rule. The select rule searches for an exact match meaning `gender` must contain `female` or `male`. If no rule applies `other` will be used. If there is no `other` rule no text will be printed.
### date and time
Printing out dates is abstracted though the message-format `{var, date}` and `{var, time}` similar to the java [implementation](http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html). A shortcut is possible with `{var, datetime}`. You can also specify how percise the date should be shown.
```YAML
short: "It is {var, datetime, short}" # It is 5/4/14, 2:15 pm
medium: "It is {var, datetime, medium}" # It is May 4, 2014, 2:15:06 pm
long: "It is {var, datetime, long}" # It is May 4, 2014 at 2:15:06 pm 
full: "It is {var, datetime, full}" # It is Sunday, May 4, 2014 at 2:15:06 pm 

# if the length is not specified medium will be used
# it can also be specified for the more percise variations like
# {var, date, long} and {var, time, short}
```

The support for dates isn't fully completed yet. Currently the implementation builds on [moment](http://momentjs.com/) but cldr is not compatible with moment so there may be some rough edges. In the future there might be either a own implementation (likely for deep integration) or at least a libary with better support for [these patterns](http://www.unicode.org/reports/tr35/tr35-29.html#Date_Format_Patterns).
## TODO
- Territory fallback like "i want British English but there is only American English"! This is useful for the auto detection of languages! I need help with this because I don't know if that'll work with most languages!
- Providing more features from [CLDR](http://cldr.unicode.org/). The plan is to automatically format numbers with the correct punctuation.
