# WD Attributes Tools

The **WD Attributes Tools** consists of a JavaScript library that incorporates in the HTML code some tools of the [WD JS DOM Tools](WD-JS-DOM-Tools) object through attributes informed in the body of the elements.

The tool gives HTML more power by enabling dynamism in the code itself, reducing the demand for scripts.

The following attributes are defined:

- [WD ATTR Action Tool](WD-ATTR-Action-Tool)
- [WD ATTR Click Tool](WD-ATTR-Click-Tool)
- [WD ATTR Config Tool](WD-ATTR-Config-Tool)
- [WD ATTR Data Tool](WD-ATTR-Data-Tool)
- [WD ATTR Device Tool](WD-ATTR-Device-Tool)
- [WD ATTR Edit Tool](WD-ATTR-Edit-Tool)
- [WD ATTR File Tool](WD-ATTR-File-Tool)
- [WD ATTR Filter Tool](WD-ATTR-Filter-Tool)
- [WD ATTR Load Tool](WD-ATTR-Load-Tool)
- [WD ATTR Mask Tool](WD-ATTR-Mask-Tool)
- [WD ATTR Page Tool](WD-ATTR-Page-Tool)
- [WD ATTR Repeat Tool](WD-ATTR-Repeat-Tool)
- [WD ATTR Send Tool](WD-ATTR-Send-Tool)
- [WD ATTR Sort Tool](WD-ATTR-Sort-Tool)
- [WD ATTR Sort Column Tool](WD-ATTR-Sort-Column-Tool)


## Attribute

To incorporate the methods in the code, the generic attribute `data` is used. The attribute structure has the prefix `data-wd-` followed by the name of the tool:

```html
<div data-wd-tool="configuration"></div>
```

Where `tool` represents the name of the tool and `configuration` the way to configure its behavior.

Each attribute is sensitive to one or more events and can affect the element itself that contains it or influence the behavior of other elements .

## Configuration

The way to set the attribute depends on the specified tool, and can be in the following ways:

### Simple Value

Occurs when the attribute's value is straightforward, without specific settings, the value is represented by its content. For example:

```html
<div data-wd-tool="1"></div>
```

### Simple Action

Occurs when the attribute's value needs to specify an action whose indication is defined by its name followed by the characters `{}`. For example:

```html
<div data-wd-tool="action{}"></div>
```
### Simple Action with Argument

It occurs when the action may require additional information, similar to a function argument. If necessary, information should be inserted between the characters `{value}`. For example:

```html
<div data-wd-tool="action{value}"></div>
```

### Multiple Actions

Occurs when the attribute's value can specify more than one action. For example:

```html
<div data-wd-tool="action¹{value¹}action²{value²}..."></div>
```

### Multiple Configurations

Occurs when the attribute value can contain multiple groups of actions. The groups of actions must be separated by the **&** character. For example:

```html
<div data-wd-tool="action¹{value¹}action²{value²}&action¹{value³}action²{value⁴}..."></div>
```

### The Action $

Some attributes require that a specific group of elements be specified, the targets of the action. This type of information is defined by the action `${}` whose value must be in the form of CSS selectors. For example:

```html
<div data-wd-tool="action{value}${css selectors}"></div>
```

## Sensitivity

The tools are executed when certain events occur, as shown below.

### Attribute change

Event linked to changing the attribute value using the [data](WD-JS-DOM-Tools#data) method.

### Click event

Event linked to the click action on the element.

### Input event

Event linked to the action of changing the value of forms.

### Loading page

Event linked to page loading.

### Loading procedures

Event linked to external data loading procedures.

### Screen resizing

Event linked to the resizing of the screen.

### Typing action

Event linked to the action of typing in forms.

### Value change

Event linked to change of value in the form element.

