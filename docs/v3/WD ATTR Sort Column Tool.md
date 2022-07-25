# WD ATTR Sort Column Tool

The purpose of the attribute is to sort table columns (`table` tag).

## Linked Methods

- [sort](WD-JS-DOM-Tools#sort)

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

Columns contained within the `tbody` tag.

## Configuration

- [Simple Value](WD-Attributes-Tools#simple-value)

## Attribute

```html
data-wd-sort-col=""
```

_It requires no value_.


## Note

The attribute must be contained in the elements `td` or `th`, children of `tr`, child of `thead`:

```html
<table>
	<thead>
		<tr>
			<th data-wd-sort-col="">Column 1</th>
			...
		</tr>
	</thead>
	<tbody>
	...
	</tbody>
</table>
```

When the element with the attribute is clicked, its column will be sorted in ascending order. If you click again, the sort order will be reversed.
