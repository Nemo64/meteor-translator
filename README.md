# translator - powerful internationalization
An i18n utility belt specifically designed for meteor to seperate your app from the language.

**[read the full documentation in the wiki](https://github.com/Nemo64/meteor-translator/wiki)** or [see the quickstart!](#quickstart)

## Features
- readable *[yaml files](http://www.yaml.org/)* or normal json files to store the language
- *namespacing* though multiple files
- *variables* in the translations `hello {username}`
- *[icu messageformat](http://userguide.icu-project.org/formatparse/messages)* using [cldr](http://cldr.unicode.org/) `{num, plural, one{You have one friend} other{You have # friends}}`
- *date formating* using [moment](http://momentjs.com/) and [cldr](http://cldr.unicode.org/) `released on {var, date} at {var, time}` (might be rough, [see below](#date-and-time))
- language *fallbacks* `["en_GB","en_US"]`
- *lazy loading* of languages as soon as they are needed
- *automatic language detection* using the `accept-language` header (experimental)
- *reactive changing* of the translations
- a *small footprint* of 10 kb uglified and even less with gzip

## Quickstart

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

## TODO
- Territory fallback like "i want British English but there is only American English"! This is useful for the auto detection of languages! I need help with this because I don't know if that'll work with most languages!
- Providing more features from [CLDR](http://cldr.unicode.org/). eg format numbers with the correct punctuation.
