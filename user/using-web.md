# Using Web Content

Support for HTML5 content and web apps is built into isotope in the form of a customized browser (or "web view") based on the ubiquitous Chromium engine. Web views support all modern web-based technologies such as media, WebGL and WebRTC.

The easiest way to integrate web content into your project is to use the [`webview` helper function](../scripting/process-helpers#web-view) when defining [`processes` in your profile script](../scripting/profile#field-processes).

Web views can be used as a transparent overlay with other content underneath. When using transparent web content, make sure that you do not have an opaque background in your CSS styles.

::: tip Example: A transparent web page
```html
<html>
    <head>
        <style>
            html, body {
                background: transparent;
                color: white;
            }
        </style>
    <body>
        <h1>Hello, World!</h1>
    </body>
</html>
```
:::
