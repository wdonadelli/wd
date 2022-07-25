# WD JS Date Tools

This object is returned in cases where the value of the `input` argument corresponds to a date value. The `type` attribute returns "date".

The time zone effects are disregarded and the value od the `input` argument take the following forms:
    
- "YYYY-MM-DD"
- "MM/DD/YYYY"
- "DD.MM.YYYY"
- "%today"
- JavaScript Date Object

#### Nomenclature

- **YYYY** - Four-digit year (integer from 0001 to 9999).
- **MM** - Month with two digits (integer from 01 to 12).
- **DD** - Day with two digits (integer from 01 to 31). 

The special string "%today" specifies the current date. The textual representation of the date must be a valid date, otherwise it will not be treated as a date and a different object will be returned.

## Attributes

### countdown

It is a attribute that gets the number of days remaining for the end of the year (last day).

### day

It is a attribute that that gets/sets the value of the day (1-31). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `d`.

### days

It is a attribute that gets the value of the day of the year (from 1).

### leap

It is a attribute that informs if it is leap year (true/false).

### month

It is a attribute that that gets/sets the value of the month from 1 (january) to 12 (december). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `m`.

### week

It is a attribute that gets the value of the day of the week from 1 (sunday) to 7 (saturday).

### weeks

It is a attribute that gets the value of the week of the year (from 1).

### width

It is a attribute that gets the number of days in a month.

### year

It is a attribute that gets/sets the value of the year (1-9999). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `y`.

### wDays

It is an attribute that returns the number of working days until the present date.

### wDaysYear

It is an attribute that returns the number of working days in the year.

## Methods

### format

It is a method that returns the data of the preformatted object.

```js
format(string, locale)
```
`string`: (optional) If not defined, will return the same object result with the toString method. The argument consists of a string where you can enter attributes of the object as format below:

- %d numerical value of the day.
- %D numerical value of the day (two digits).
- @d day of year.
- %m numerical value of the month.
- %M numerical value of the month (two digits).
- @m number of days in month.
- #m short name of the month.
- #M long name of the month.
- %y numerical value of year.
- %Y numerical value of year (four-digit).
- %w numerical value of day of week.
- @w numerical value of week of year.
- #w short name of the day of week.
- #W long name of the day of week.
- %l days in the year.
- %c days remaining for the end of the year.
- %b Business days in the year until the specified date.
- %B Business days in the year.

`locale`: (optional) Consists of a string representing the location (e.g. "pt-BR"). If not set, the location will be the one entered in the lang attribute of the html tag, the provided browser value or "en-US".

### longMonth

It is a method that returns the long name of the month.

```js
longMonth(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### longWeek

It is a method that returns the long name of the day of week.

```js
longWeek(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### shortMonth

It is a method that gets the short name of the month.

```js
shortMonth(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### shortWeek

It is a method that returns the short name of the day of week.

```js
shortWeek(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### toString

returns the date in "YYYY-MM-DD" format.

```js
toString()
```

### valueOf

Returns the number of days elapsed from 0001-01-01 (day 1) until day 9999-12-31 (last day), based on the projection of the Gregorian calendar. If the date limit is exceeded, the date will be set at the respective limit.

```js
valueOf()
```
