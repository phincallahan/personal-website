// grunt/config/postcss.js

module.exports = {
	options: {
		map: true, 
		    processors: [
			    require('autoprefixer')({
				    browsers: ['last 2 versions']
				})
			]
	},

	dev: {
	    src: 'dist/assets/css/*.css'
    }
}

