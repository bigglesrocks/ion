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

See [Getting Setup](https://github.com/jlegosama/ion/wiki/Getting-Setup) for a more detailed setup guide.


## Basic Usage

The Ion constructor takes 3 arguments:

`canvasId`: **string** _required_ ID of the `<canvas>` element Ion should use

`particleSettings`: **object** or **array of objects** _optional_ [Particle Options](https://github.com/jlegosama/ion/wiki/Particle-Options)

`options`: **object** _optional_ Global options for Ion

```javascript

 new Ion(canvasId, particleSettings, options);

```

If you don't pass any `particleSettings` when constructing the Ion instance, you can set them later and start particle generation with:

```javascript

// Create a new instance of Ion, but don't generate any particles
var ion = new Ion('canvas');

// Set the particle
ion.setParticles(particleSettings);

// Start particle generation
ion.start();

```

## Advanced Usage

- [Particle Randomization](https://github.com/jlegosama/ion/wiki/Variance-&-Randomization) 

- [Custom Particle Shapes](https://github.com/jlegosama/ion/wiki/Custom-Particle-Shapes)








