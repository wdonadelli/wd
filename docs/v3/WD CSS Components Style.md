# WD CSS Components Style

Component styles are generally applied to containers, changing the behavior of the element or its children. The behavior is defined based on class attributes.

<!----------------------------------------------------------------------------->
## Block

Displays the children of the element as blocks that occupy the horizontal space.

### Parent Element

- `wd-block`: Defines the behavior.

```html
<nav class="wd-block">
	<span>Horizontal Block 1</span>
	<span>Horizontal Block 2</span>
	...
</nav>
```

<!----------------------------------------------------------------------------->
## Code

Defines a space for writing computational coding. The highlights of the code are stylized using the HTML elements `cite`,` em`, `kbd`,` q`, `samp` and` var`.

### Parent Element

- `wd-code`: Defines an element for defining the code.

### Child Elements

- `cite`: The HTML tag defines formatting for comments.
- `em`: The HTML tag defines formatting to emphasize reserved words in the code.
- `kbd`: The HTML tag defines formatting HTML tags.
- `q`: The HTML tag defines formatting for strings.
- `samp`: The HTML tag defines formatting for returns.
- `var`: The HTML tag define formatting for values.
- `span`: defines a numbered line (must be a direct child of the container and contain all the elements of that line)

```html
<pre class="wd-code">
	<cite>//comment text</cite>
	<em>reserved words</em>
	<kbd>html tag</kbd>
	<q>string</q>
	<samp>returns</samp>
	<var>values</var>
</pre>
```

<!----------------------------------------------------------------------------->
## Columns

These are buildings of horizontally aligned blocks.

### Parent Element

- `wd-row`: defines the parent container that will group the columns.

### Child Elements

- `wd-col-??`: defines the child container that will have the column behavior.

The characters `??` define the column size. The size is represented by an integer from 01 to 12 (two digits) that indicate the number of spaces occupied among 12 available.

```html
<div class="wd-row">
	<div class="wd-col-06">06/12</div>
	<div class="wd-col-03">03/12</div>
	<div class="wd-col-02">02/12</div>
	<div class="wd-col-01">01/12</div>
</div>
```

### Ancestral element

- `wd-col-center-??`: Centers the text of the indicated column.
- `wd-col-right-??`: Align the text of the indicated column to the right.
- `wd-col-left-??`: Left align the text of the indicated column.
- `wd-col-blue-??`: Sets blue as the font color of the indicated column
- `wd-col-red-??`: Defines red as the font color of the indicated column
- `wd-col-green-??`: Sets green as the font color of the indicated column
- `wd-col-mark-??`: Highlights the column of the indicated column

The class attributes above must be placed in an element immediately ancestral to the container that has the class attribute `wd-row`, whose objective will be to group the rows of the columns, similar to the function of the element `tbody` of the `table` element. The attributes can even be used in the element `thead`, `tbody` and `tfoot` to organize the columns of the table, observing the limit of 12 columns only.

The characters `??` indicate the column to have the behavior applied. The column is indicated by an integer from 01 to 12 (two digits) that represents its position in relation to the parent container, that is, "01" represents the first child, "02" the second child and so on.

```html
<table>
	...
	<tbody class="wd-col-center-02 wd-col-right-03 wd-col-left-04 wd-col-blue-05 wd-col-red-06 wd-col-green-07 wd-col-mark-08">
		<tr>
			<td>Col 1 (normal)</td>
			<td>Col 2 (center)</td>
			<td>Col 3 (right)</td>
			<td>Col 4 (left)</td>
			<td>Col 5 (blue)</td>
			<td>Col 6 (red)</td>
			<td>Col 7 (green)</td>
			<td>Col 8 (mark)</td>
		</tr>
		...
	</tbody>
</table>
```

<!----------------------------------------------------------------------------->
## Form Input Messages

Enables you to display an informational (`input`, `select`, `textarea`, `button`) or alert message (`input`, `select`, `textarea`) when the form element receives focus. The alert message has priority over the informational message and will be displayed if the value of the field does not comply with the specified (low compatibility).

### Parent Element

- `wd-form-msg`: Defines the characteristics of a message box for the form element.

The message container must be the __next sibling__ of the form element.

### Child Elements

- `wd-form-msg-info`: Defines the textual content of the informational message.
- `wd-form-msg-warn`: Defines the textual content of the alert message.

```html
<input type="text" required="" />
<div class="wd-form-msg">
	<span class="wd-form-msg-info">Informational message</span>
	<span class="wd-form-msg-warn">Alert message</span>
</div>
```

<!----------------------------------------------------------------------------->
## Grid

Sets the display of child elements as inline blocks aligned in the center.

### Parent Element

- `wd-grid`: Defines short title inline blocks.
- `wd-hgrid`: Defines inline blocks of the landscape type.
- `wd-sgrid`: Defines inline blocks of the square type.
- `wd-vgrid`: Defines inline portrait blocks.

```html
<div class="wd-grid">
	<span>Item 1</span>
	<span>Item 2</span>
	...
</div>
```

<!----------------------------------------------------------------------------->
## In Line

Sets the display of child elements as horizontally aligned inline blocks (without line break).

### Parent Element

- `wd-line`: Defines inline blocks in a generic way.
- `wd-hline`: Defines inline blocks of the landscape type.
- `wd-sline`: Defines inline blocks of the square type.
- `wd-vline`: Defines inline portrait blocks.

```html
<div class="wd-hline">
	<span>Item 1</span>
	<span>Item 2</span>
	...
</div>
```


<!----------------------------------------------------------------------------->
## Report

Formats textual content using predefined HTML tags.

### Parent Element

 - `wd-report`: Defines the container that will be formatted.
 - `wd-itemize`: It is optional and must be used in conjunction with the class attribute `wd-report`, its purpose is to itemize the paragraphs.

### Child Elements

- `h1`: Defines the report title.
- `h2`: Defines the subtitle of the report
- `h3`: Defines the numberable chapters of the report.
- `p`: Defines the report's paragraphs.
- `blockquote`: Defines the long quote.
- `ol`: Defines sub-items whose hierarchy is itemized as follows: Roman numbers, alphabetic characters and numeric characters.
- `ul`: Defines a list of items.
- `table`: Defines a table.
- `caption`: Defines the indication of the table.
- `figure`: Defines an image container.
- `figcaption`: Defines the indication of the figure.

__Note__: Use the `title` attribute to define the text that will be prefixed, before the number, in the chapters (`h3`), paragraphs (`p`) and table and image indicators (`caption` and `figcaption`).

```html
<section class="wd-report">
	<h1>Title</h1>
	<h2>Subtitle</h2>
	<h3>The First Chapter</h3>
	<p>Paragraph...</p>
	...
	<h3>The Second Chapter</h3>
	...
</section>
```

<!----------------------------------------------------------------------------->
## Tip Box

It allows the creation of a hidden box that is displayed when resting the mouse or clicking on the element.

### Parent Element

- `wd-tip`: Creates the hidden box container.

### Child Elements

#### Hover

- `wd-tip-hover-top`: Defines the content of the tip that will be displayed at the top when resting the mouse.
- `wd-tip-hover-right`: Defines the hint content that will be displayed on the right when resting the mouse.
- `wd-tip-hover-bottom`: Defines the content of the tip that will be displayed at the bottom when resting the mouse.
- `wd-tip-hover-left`: Defines the content of the tip that will be displayed on the left when resting the mouse.

```html
<div class="wd-tip">
	<button type="button" >Hover</button>
	<div class="wd-tip-hover-top">Hello!</div>
</div>
```

#### Click

- `wd-tip-click-top`: Defines the content of the tip that will be displayed at the top when clicking on the element.
- `wd-tip-click-right`: Defines the hint content that will be displayed on the right when clicking on the element.
- `wd-tip-click-bottom`: Defines the content of the tip that will be displayed at the bottom clicking on the element.
- `wd-tip-click-left`: Defines the content of the tip that will be displayed on the left clicking on the element.

To display the contents of the box with the click event, the parent container (`wd-tip`) will need to receive the class attribute `wd-open`. 

See [action method](WD-JS-DOM-Tools#action) and [action attribute](WD-ATTR-Action-Tools).

```html
<div class="wd-tip" id="tip">
	<button type="button" data-wd-action="toggle-open{#tip}">Click</button>
	<div class="wd-tip-click-top">Hello!</div>
</div>
```

<!----------------------------------------------------------------------------->
## Window

Define resources for creating dialog boxes.

### Dialog Box

- `wd-window`: Defines a centralized dialog box.
- `wd-window-full`: Defines a full-screen dialog.
- `wd-window-top`: Defines a top dialog box.
- `wd-window-right`: Defines a dialog box on the right.
- `wd-window-bottom`: Defines a lower dialog box.
- `wd-window-left`: Defines a dialog box on the left.


__Note__: The element will open when it receives the class value `wd-open`. See [action method](WD-JS-DOM-Tools#action) and [action attribute](WD-ATTR-Action-Tool). When it is inserted in a container with the value `wd-modal`, who should receive the value `wd-open` is the parent container only.

```html
<aside class="wd-window wd-open">
	<h3>Hello!</h3>
</aside>
```

### Background

- `wd-modal`: Sets a background for displaying the dialog box, preventing the elements of the main window from being manipulated while the window is open.

The element will open when it receives the class value `wd-open`. See [action method](WD-JS-DOM-Tools#action) and [action attribute](WD-ATTR-Action-Tool).

```html
<div class="wd-modal wd-open">
	<aside class="wd-window">
		<h3>Hello!</h3>
	</aside>
</div>
```

## Flyer

Defines a block of elements that fits the child elements `header`, `footer` and `nav`.

- `wd-flyer`: defines the behavior in the container

```html
<section class="wd-flyer">
	<header>
		<h2>Header</h2>
	</header>
	
	<p>Paragraph...</p>
	...
</section>
```
