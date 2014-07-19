## v0.6.1
- fixed localized default number formatting
- fixed edge cases with `/a/g.test`
- added written number support (1 thousand)

## v0.6.0
- added localized number message-format `{var, number}`

## v0.5.3
- locale type now accepts all cldr locales
- the parser now is capable of `lang.json`

## v0.5.2
- fixed missuse of multiline expressions
- modified message-format parser to allow acccess to `rawArgs`
- date and time formats accept now direct format input

## v0.5.1
- size optimisation
- code cleanup

## v0.5.0
- icu message format instead of homebrew syntax (incompatible)
- message format methods (select, plural, date & time, number)
- dependency: node-cldr for common language patterns
- dependency: moment for dates and times (not very compatible with cldr, better solution required)

## v0.4.3
- new filter for pluralization and general conditions
- fix in language compiler that allowed all keys to go through

## v0.4.2
- package restructored
- removed parameter warnings (not needed)

## v0.4.1
- fixed error when paring an empty EJSON LanguageArray
- cleaner language detection with tests
- `Translator.setDefaultLanguage` added

## v0.4.0
- a lot of cleanup
- the client now knows which namespaces exist
- the language can now be detected automatically (client only)

## v0.3.0
- fixed namespace not directly loading when setting the language first
- added tests for the Translator object
- FilterList allows to change the output
- added default filter for parameters

## v0.2.0
- added support for helpers
- rewrote README

## v0.1.1
- fixed an error in the tests related to Locales
- updated descripton for atmosphere

## v0.1.0
- initial release
