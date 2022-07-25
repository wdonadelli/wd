# WD ATTR Page Tool

The purpose of the attribute is splits the children of the element into groups and display only a certain group.

## Linked Methods

- [page](WD-JS-DOM-Tools#page)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)

## Target

Children of the element.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<div data-wd-page="size{value¹}page{value²}">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
	...
</div>
```

`value¹`: value linked to the `size` argument of the [page](WD-JS-DOM-Tools#page) method.

`value²`: value linked to the `page` argument of the [page](WD-JS-DOM-Tools#page) method.
