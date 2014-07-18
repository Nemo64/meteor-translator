# translator - powerful internationalization
An i18n utility belt specifically designed for meteor to seperate your app from the language.

**[read the full documentation in the wiki](https://github.com/Nemo64/meteor-translator/wiki)** or [see the quickstart!](#quickstart)

## Features
- readable *[yaml files](http://www.yaml.org/)* or normal json files to store the language [~docs](https://github.com/Nemo64/meteor-translator/wiki/Writing-Language-Files#examples)
- *namespacing* though multiple files [~docs](https://github.com/Nemo64/meteor-translator/wiki/Writing-Language-Files)
- *variables* in the translations `hello {username}` [~docs](https://github.com/Nemo64/meteor-translator/wiki/Variables)
- *[icu messageformat](http://userguide.icu-project.org/formatparse/messages)* using [Unicode cldr](http://cldr.unicode.org/) [~docs](https://github.com/Nemo64/meteor-translator/wiki/Plural%20and%20Select%20patterns)
- *date formating* using [moment](http://momentjs.com/) and [cldr](http://cldr.unicode.org/) `released on {var, date}` [~docs](https://github.com/Nemo64/meteor-translator/wiki/Date-and-Time-patterns#implementation)
- *localized number formating* again using [cldr](http://cldr.unicode.org/) `{var, number}`
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
- Providing more features from [CLDR](http://cldr.unicode.org/)
