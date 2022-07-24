# WD ATTR Slide Tool

The purpose of the attribute is to toggle the display of child elements within the defined time interval, such as an automatic slide transition.

## Linked Methods

- [action](WD-JS-DOM-Tools#action)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)

## Target

Children of the element.

## Configuration

- [Simple Value](WD-Attributes-Tools#simple-value)

## Attribute

```html
<div data-wd-slide="time">
	<div>Slide 1</div>
	<div>Slide 2</div>
	<div>Slide 3</div>
</div>
```

`time`: Time interval of transitions between child elements. The value must be an integer greater than zero, the default value is 1000 milliseconds.
