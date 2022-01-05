# WD CSS Utilities Style

Utility styles are those with a more specific configuration and greater power, which can overlap more generic styles.

<!----------------------------------------------------------------------------->
## Align

Sets the text alignment. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-align-left`: left
- `wd-align-center`: center
- `wd-align-right`: right
- `wd-align-justify`: justify
- `wd-align-middle`: in the middle
- `wd-align-top`: on the top
- `wd-align-bottom`: at the bottom

<!----------------------------------------------------------------------------->
## Attributes

Displays the content of the attribute after its textual content.

- `wd-attr-cite`: displays the cite
- `wd-attr-href`: displays the link
- `wd-attr-title`: displays the title

<!----------------------------------------------------------------------------->
## Background Color

Sets the background color. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-bg-black`: black
- `wd-bg-white`: white
- `wd-bg-grey`: grey
- `wd-bg-red`: red
- `wd-bg-green`: green
- `wd-bg-blue`: blue
- `wd-bg-yellow`: yellow
- `wd-bg-orange`: orange
- `wd-bg-brown`: brown
- `wd-bg-pink`: pink
- `wd-bg-purple`: purple
- `wd-bg-none`: transparent
- `wd-bg-basic`: black and white

<!----------------------------------------------------------------------------->
## Background Image

Sets an image as the background.

- `wd-bg-image`: the image will occupy the entire container
- `wd-bg-photo`: the image will fit into the container
- `wd-bg-paper`: a still image will be defined
- `wd-bg-figures`: the image will multiply side by side 

To define the image it is necessary to use the attribute `style`:

```html
<div style="background-image: url(image path); height: 200px;" class="wd-bg-image">Image</div>
```

<!----------------------------------------------------------------------------->
## Border

Sets the container border. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

### Quantitative behavior

- `wd-border`: border (level 1)
- `wd-xborder`: border (level 2)
- `wd-xxborder`: border (level 3)
- `wd-border-none`: without border.

### Qualitative behavior

- `wd-border-top`: top border (level 1)
- `wd-border-right`: right border (level 1)
- `wd-border-bottom`: bottom border (level 1)
- `wd-border-left`: left border (level 1)
- `wd-border-length`: left and right border (level 1)
- `wd-border-height`: top and bottom border (level 1)
- `wd-xborder-top`: top border (level 2)
- ...
- `wd-xxborder-top`: top border (level 3)
- ...

### Closing the block

- `wd-border-box`: Adds a thin transparent border to close the block in situations where the dimensions of the child element exceed the limits of the parent element due to the `box-sizing` attribute being set to `border-box`.


<!----------------------------------------------------------------------------->
## Buddy

Makes the element follow the vertical movement of the page within the boundaries of the parent container. It has low compatibility.

- `wd-buddy-top`: stuck at the top
- `wd-buddy-bottom`: stuck at the bottom

<!----------------------------------------------------------------------------->
## Case

Defines about the font (uppercase / lowercase). The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-case-upper`: uppercase
- `wd-case-normal`: Cancels the effects of other
- `wd-case-lower`: lowercase
- `wd-case-title`: the first letter of each word is capitalized
- `wd-case-caps`: it is the union of the `wd-case-upper` and `wd-case-title` attributes

<!----------------------------------------------------------------------------->
## Cloud

Sets cloud on the element.

- `wd-cloud`: defines behavior*
- `wd-cloud-enter`: behavior defined when entering the element with the mouse*
- `wd-cloud-leave`: defined behavior when removing the mouse from the element*
- `wd-cloud-in`: behavior defined when entering the mouse into the parent container.
- `wd-cloud-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-cloud-none`: without cloud/shadow.

\* The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

```html
<div class="wd-cloud-enter">
	<span>...</span>
	<span>Parent element gains effect when hovering.</span>
	<span>...</span>
</div>

<div>
	<span>...</span>
	<span class="wd-cloud-in">I gain the effect by hovering the mouse over the parent element.</span>
	<span>...</span>
</div>
```

<!----------------------------------------------------------------------------->
## Color

Sets the font color. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-fg-black`: black
- `wd-fg-white`: white
- `wd-fg-grey`: grey
- `wd-fg-red`: red
- `wd-fg-green`: green
- `wd-fg-blue`: blue
- `wd-fg-yellow`: yellow
- `wd-fg-orange`: orange
- `wd-fg-brown`: brown
- `wd-fg-pink`: pink
- `wd-fg-purple`: purple
- `wd-fg-none`: basic black

<!----------------------------------------------------------------------------->
## Icon

Defines a pre-positioned icon in the textual content. As they are HTML symbols, the icons may be different in different browsers as well as they may not be properly implemented.

### Math

- `wd-icon-plus`: Icon representing an addition.
- `wd-icon-minus`: Icon representing a subtraction.
- `wd-icon-times`: Icon representing a multiplication.
- `wd-icon-divide`: Icon representing a division.

### Media

- `wd-icon-play`: Icon representing a start.
- `wd-icon-stop`: Icon representing a stop.
- `wd-icon-forward`: Icon representing an advance.
- `wd-icon-backward`: Icon representing a setback.
- `wd-icon-rec`: Icon representing a recording.
- `wd-icon-music`: Icon representing something musical.
- `wd-icon-video`: Icon representing something audiovisual.
- `wd-icon-image`: Icon representing some image.
- `wd-icon-www`: Icon representing web browsing.
- `wd-icon-voice`: Icon representing a voice.
- `wd-icon-news`: Icon representing news.

### Alerts

- `wd-icon-info`: Icon representing an information.
- `wd-icon-warn`: Icon representing an alert.
- `wd-icon-doubt`: Icon representing a question.
- `wd-icon-ok`: Icon representing a success.
- `wd-icon-error`: Icon representing an error.

### Actions

- `wd-icon-copy`: Icon representing a copy action.
- `wd-icon-cut`: Icon representing a cutout action.
- `wd-icon-paste`: Icon representing a collage action.
- `wd-icon-open`: Icon representing an open action.
- `wd-icon-new`: Icon representing a new action.
- `wd-icon-file`: Icon representing a file.
- `wd-icon-save`: Icon representing a registration action.
- `wd-icon-attach`: Icon representing an attach action.
- `wd-icon-search`: Icon representing a search action.
- `wd-icon-download`: Icon representing a get action.
- `wd-icon-upload`: Icon representing a send action.
- `wd-icon-link`: Icon representing a link action.
- `wd-icon-bookmark`: Icon representing something favorite.
- `wd-icon-bell`: Icon representing an alert action.
- `wd-icon-help`: Icon representing a reminder action.
- `wd-icon-home`: Icon representing a start action.
- `wd-icon-target`: Icon representing a goal.
- `wd-icon-door`: Icon representing an exit action.
- `wd-icon-close`: Icon representing a close action.
- `wd-icon-reload`: Icon representing an reload action.
- `wd-icon-config`: Icon representing an action to configure.
- `wd-icon-menu`: Icon representing a menu.
- `wd-icon-list`: Icon representing a list.
- `wd-icon-key`: Icon representing something restricted.
- `wd-icon-unlocked`: Icon representing something open.
- `wd-icon-locked`: Icon representing something closed.
- `wd-icon-battery`: Icon representing a level.
- `wd-icon-sound`: Icon representing a sound action.
- `wd-icon-network`: Icon representing an action.
- `wd-icon-user`: Icon representing an user.

### Genre

- `wd-icon-he`: Icon representing a male intention.
- `wd-icon-she`: Icon representing a female intention.

### Arrows

- `wd-icon-n`: Icon representing the north.
- `wd-icon-ne`: Icon representing the northeast.
- `wd-icon-e`: Icon representing the east.
- `wd-icon-se`: Icon representing the southeast.
- `wd-icon-s`: Icon representing the south.
- `wd-icon-sw`: Icon representing the southwest.
- `wd-icon-w`: Icon representing the west.
- `wd-icon-nw`: Icon representing the northwest.
- `wd-icon-soon`: Icon representing that coming soon.
- `wd-icon-back`: Icon representing the return.
- `wd-icon-top`: Icon representing the top.
- `wd-icon-right`: Icon representing the right side.
- `wd-icon-left`: Icon representing anthe left side.

### Devices

- `wd-icon-email`: Icon representing an email.
- `wd-icon-mail`: Icon representing a mail.
- `wd-icon-phone`: Icon representing a phone.
- `wd-icon-mobile`: Icon representing a mobile device.
- `wd-icon-clock`: Icon representing a clock.
- `wd-icon-date`: Icon representing a date.
- `wd-icon-time`: Icon representing a time.
- `wd-icon-chart`: Icon representing a chart.
- `wd-icon-increase`: Icon representing a positive results.
- `wd-icon-decrease`: Icon representing a negative results.
- `wd-icon-money`: Icon representing money.
- `wd-icon-radio`: Icon representing a radio.
- `wd-icon-tv`: Icon representing a TV.
- `wd-icon-cam`: Icon representing a camera.

### Custom

- `wd-icon-custom`: It allows the definition of an icon from an image (`img` object).

```html
<h1><img src="image path" class="wd-icon-custom" /> My Icon</h1>
```

<!----------------------------------------------------------------------------->
## Margin

Sets the container margin. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

### Quantitative behavior

- `wd-margin`: margin (level 1)
- `wd-xmargin`: margin (level 2)
- `wd-xxmargin`: margin (level 3)
- `wd-margin-none`: without margin.

### Qualitative behavior

- `wd-margin-top`: top margin (level 1)
- `wd-margin-right`: right margin (level 1)
- `wd-margin-bottom`: bottom margin (level 1)
- `wd-margin-left`: left margin (level 1)
- `wd-margin-length`: left and right margin (level 1)
- `wd-margin-height`: top and bottom margin (level 1)
- `wd-xmargin-top`: top margin (level 2)
- ...
- `wd-xxmargin-top`: top margin (level 3)
- ...

<!----------------------------------------------------------------------------->
## Opaque

Sets opacity on the element.

- `wd-opaque`: defines behavior*
- `wd-opaque-enter`: behavior defined when entering the element with the mouse*
- `wd-opaque-leave`: defined behavior when removing the mouse from the element*
- `wd-opaque-in`: behavior defined when entering the mouse into the parent container.
- `wd-opaque-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-opaque-none`: without opacity.

\* The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

See the example of the [`cloud`](#cloud) section.

<!----------------------------------------------------------------------------->
## Padding

Sets the container padding. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

### Quantitative behavior

- `wd-padding`: padding (level 1)
- `wd-xpadding`: padding (level 2)
- `wd-xxpadding`: padding (level 3)
- `wd-padding-none`: without padding.

### Qualitative behavior

- `wd-padding-top`: top padding (level 1)
- `wd-padding-right`: right padding (level 1)
- `wd-padding-bottom`: bottom padding (level 1)
- `wd-padding-left`: left padding (level 1)
- `wd-padding-length`: left and right padding (level 1)
- `wd-padding-height`: top and bottom padding (level 1)
- `wd-xpadding-top`: top padding (level 2)
- ...
- `wd-xxpadding-top`: top padding (level 3)
- ...

<!----------------------------------------------------------------------------->
## Place

Specifies the placement of the child element within the container (parent). Specifies the placement of the child element within the container (parent). The parent element cannot contain the placement set to `static`.

- `wd-place-n`: north
- `wd-place-ne`: northeast
- `wd-place-e`: east
- `wd-place-se`: southeast
- `wd-place-s`: south
- `wd-place-sw`: southwest
- `wd-place-w`: west
- `wd-place-nw`: northwest
- `wd-place-ctr`: center

```html
<div style="position: relative; height: 200px;">
	<span class="wd-place-ctr">Center</span>
</div>
```

<!----------------------------------------------------------------------------->
## Radius

Sets the container border radius. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-radius-top`: top border radius (nw and ne)
- `wd-radius-right`: right border radius (ne and se)
- `wd-radius-bottom`: bottom border radius (se and sw)
- `wd-radius-left`: left border radius (sw and nw)
- `wd-radius-none`: without border radius.

<!----------------------------------------------------------------------------->
## Shadow

Sets shadow on the element.

- `wd-shadow`: defines behavior*
- `wd-shadow-enter`: behavior defined when entering the element with the mouse*
- `wd-shadow-leave`: defined behavior when removing the mouse from the element*
- `wd-shadow-in`: behavior defined when entering the mouse into the parent container.
- `wd-shadow-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-shadow-none`: without cloud/shadow.

\* The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

See the example of the [`cloud`](#cloud) section.

<!----------------------------------------------------------------------------->
## Show/Hide

- `wd-show`: leaves the element visible
- `wd-hide`: leaves the element invisible
- `wd-overlook`: neglects the element in the HTML document
- `wd-show-box`: leaves the element visible when the mouse enters the parent element
- `wd-hide-box`: leaves the element invisible when the mouse enters the parent element
- `wd-show-print`: leaves the element visible during printing
- `wd-hide-print`: leaves the element invisible during printing
- `wd-overlook-print`: neglects the element in the HTML document when printing

<!----------------------------------------------------------------------------->
## Size

Sets the font size. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-size-xxsmall`: small (level 3)
- `wd-size-xsmall`: small (level 2)
- `wd-size-small`: small (level 1)
- `wd-size-smaller`: relatively small
- `wd-size-medium`: default
- `wd-size-larger`: relatively large
- `wd-size-large`: large (level 1)
- `wd-size-xlarge`: large (level 2)
- `wd-size-xxlarge`: large (level 3)

<!----------------------------------------------------------------------------->
## Text Formatting

Styles in order to apply textual formatting, meeting the need to use specific HTML elements. The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

- `wd-b`: bold
- `wd-u`: italic
- `wd-i`: underlined
- `wd-s`: strikethrough
- `wd-mark`: highlighted

To cancel formatting:

- `wd-b-none`: bold
- `wd-i-none`: italic
- `wd-line-none`: underlined and strikethrough
- `wd-mark-none`: highlighted
- `wd-plain`: all

<!----------------------------------------------------------------------------->
## Upon

Defines highlighting for the element.

- `wd-upon`: defines behavior*
- `wd-upon-enter`: behavior defined when entering the element with the mouse*
- `wd-upon-in`: behavior defined when entering the mouse into the parent container.
- `wd-upon-toggle`: defines the behavior of the element's children alternately.

\* The suffix [`-child`](WD-Style-Sheet#inheritances) applies.

See the example of the [`cloud`](#cloud) section.
