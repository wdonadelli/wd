# WD CSS Structural Style

Defines the behavior of the HTML document focused on the `body` element. The `main` element is considered as the element that concentrates the content of the document.

## Center

Defines the margins of the `main` element, if any.

- `wd-center`: Horizontally centers the `main` element, leaving the page content separate from the borders.
- `wd-left`: Aligns the `main` element to the left, leaving the page content separate from this border.
- `wd-right`: Aligns the `main` element to the right, leaving the page content separate from this border.

```html
<body class="wd-center">
	<header>
		<h1>Header</h1>
	</header>

	<main>
		...
	</main>
</body>
```

## Fixed

Sets the elements `header` and` footer`, children of `body`, at the top and bottom of the page, respectively.

- `wd-fixed`: defines the behavior.

```html
<body class="wd-fixed">
	<header>
		<h1>Header</h1>
	</header>

	<main>
		...
	</main>
</body>
```
