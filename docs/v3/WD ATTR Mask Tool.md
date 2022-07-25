# WD ATTR Mask Tool

The purpose of the tribute is to apply a mask to the textual content of the element if its value matches the defined regular expression.

## Linked Methods

- [mask](WD-JS-RegExp-Tools#mask)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Input event](WD-Attributes-Tools#input-event)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)
- [Typing action](WD-Attributes-Tools#typing-action)

## Target

Textual content of the element.

## Configuration

- [Simple Value](WD-Attributes-Tools#simple-value)

## Attribute

```html
<input type="text" data-wd-mask="value" />
```

`value`: Regular expression that defines the mask format or the following shortcuts:

- `YYYYMMDD`: Date in "9999-12-31" format.
- `MMDDYYYY`: Date in "12/31/9999" format.
- `DDMMYYYY`: Date in "31.12.9999" format.
- `HHMMSS`: Time in "24:59:59" format.
- `HHMM`: Time in "24h59" format.
- `AMPM`: Time in "12:59am"/"12:59pm" format.

**Note**: It is just a mask, the attribute will not check the value. In form elements (_input, textarea, select, button_), masks can only be applied to text input elements (_textarea, text, email, search, tel, url_) and buttons, except the "submit" type.
