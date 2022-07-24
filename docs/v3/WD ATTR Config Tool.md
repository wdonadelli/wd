# WD ATTR Config Tool

The purpose of the attribute is to define some basic user interface settings.

## Linked Methods

_No associated method._.

## Sensitivity

- [Value change](WD-Attributes-Tools#value-change)

## Target

The `body` element. The attribute must be inserted from the document's body tag.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<body data-wd-config="loading{value¹}bgcolor{value²}color{value³}fileSize{value⁴}fileTotal{value⁵}fileChar{value⁶}fileLen{value⁷}fileType{value⁸}" >
	...
```

`modalMsg`: Defines the phrase during the web request.

`modalFg`: Defines the font color during the web request.

`modalBg`: Defines the color of the window during the web request.

`fileTitle`: Sets the title of the message box (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

`fileSize`: Defines the restriction phrase for the individual file size (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

`fileTotal`: Defines the total file size restriction phrase (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

`fileChar`: Defines the restriction phrase of the characters not allowed in the file name (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

`fileLen`: Defines the restriction phrase for the total number of files (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

`fileType`: Defines the restriction phrase for the file type (see [WD ATTR File Tool](WD-ATTR-File-Tool)).

**Note**: All settings are optional.
