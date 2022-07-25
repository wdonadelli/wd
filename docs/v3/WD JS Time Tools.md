# WD JS Time Tools

This object is returned in cases where the value of the `input` argument corresponds to a time value. The `type` attribute returns "time".

The time zone effects are disregarded and the value od the `input` argument take the following forms:

- "H:MM"
- "H:MM:SS"
- "HhMM" *
- "H12:MM AM" **
- "H12:MM PM" **
- "%now"

<small>* _case insensitive_</small><br>
<small>** _case insensitive and with optional white space_</small>

#### Nomenclature

- **H** - Hour with one or two digits (integer from 0 to 24).
- **MM** - Minutes with two digits (integer from 00 to 59).
- **SS** - Seconds with two digits (integer from 00 to 59).
- **H12** - 12h clock (integer from 1 to 12). 

The special string "%now" specifies the current time. The textual representation of the date must be a valid time, otherwise it will not be treated as a time and a different object will be returned.

## Attributes

### h12

This is a attribute that gets the time in 12-hour format.

### hour

It is a attribute that that gets/sets the value of the hours (0-24). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `h`.

### minute

It is a attribute that that gets/sets the value of the minutes (00-59). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `m`.

### second

It is a attribute that that gets/sets the value of the seconds (00-59). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `s`.

## Methods

### format

It is a method that returns the time of the preformatted object.

```js
format(string, locale)
```

`string`: (optional) If not defined, will return the same object result with the toString method. The argument consists of a string where you can enter attributes of the object as format below:

- %h Numerical value of the hour.
- %H Numerical value of the hour (two digits).
- #h Time in 12-hour format.
- %m Numerical value of the minutes.
- %M Numerical value of the minutes (two digits).
- %s Numerical value of the seconds.
- %S Numerical value of the seconds (two digits)

`locale`: (optional) Consists of a string representing the location (e.g. "pt-BR"). If not set, the location will be the one entered in the lang attribute of the html tag, the provided browser value or "en-US".

### toString

The toString method returns the time in "HH:MM:SS" format.

```js
toString()
```

### valueOf

The valueOf method returns the number of seconds elapsed from 0 (00:00:00) until 86399 (23:59:59). If the time limit has been exceeded, plus or minus, the count will restart by observing the day cycle.

```js
valueOf()
```
