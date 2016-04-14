#Ion
Ion is a particle generator written in javascript and powered by canvas. It has no dependecies and is pure javascript.

[Demo](https://jlegosama.github.io/ion)

## Quickstart

Install ion (bower, npm, or manually):

```bash
    bower install ionjs
    npm install ionjs
```

Add ion & a canvas element to your page:

```html
    <canvas id="ioncanvas"></canvas>
    <script type="text/javascript" src="ion-min.js"></script>
```

Create a new instance of Ion with desired options:

```javascript
    var ion = new Ion('ioncanvas', {
        shape: 'circle',
        density: 20,
        color: '#000000'
       }
    ); 
```

See [Getting Setup](https://github.com/jlegosama/ion/wiki/Getting-Setup) for a more detailed setup guide








