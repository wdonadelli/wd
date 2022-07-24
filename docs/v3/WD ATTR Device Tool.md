# WD ATTR Device Tool

The purpose of the tribute is to make the element responsive by defining classes depending on screen size, without the need for specific CSS code.

## Linked Methods

- [class](WD-JS-DOM-Tools#class)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)
- [Screen resizing](WD-Attributes-Tools#screen-resizing)

## Target

The element itself.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<div data-wd-device="action¹{value¹}action²{value²}...">...</div>
```

`action`: Screen reference:

- desktop
	- For screen sizes starting at 768px.
	- Eliminates classes defined on mobile, tablet and phone.
- mobile
	- For screen sizes smaller than 768px.
	- Eliminates classes defined on desktop.
- tablet
	- For screen sizes from 600 to 767px.
	- Eliminates classes defined on desktop and phone.
- phone
	- For screen sizes smaller than 600px.
	- Eliminates classes defined on desktop and tablet.

`value`: Class names separated by space.
